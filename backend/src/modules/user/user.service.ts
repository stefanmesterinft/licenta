import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FindManyOptions, Repository, getManager, Transaction, TransactionRepository, In } from 'typeorm';
import { RoleType } from '../../common/constants/role-type';
import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserCreateDto } from './dto/UserCreate.dto';
import { UsersPageDto } from './dto/UsersPage.dto';
import { UsersPageOptionsDto } from './dto/UsersPageOptions.dto';
import { UserUpdateDto } from './dto/UserUpdate.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRegisterDto } from '../auth/dto/UserRegister.dto';
import { UsersTypeaheadPageDto } from './dto/UsersTypeaheadPage.dto';

@Injectable()
export class UserService extends BaseService {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service
    ) {
        super();
    }

    protected _getRepository(): Repository<UserEntity> {
        return this.userRepository;
    }

    /**
     * Find single user
     */
    findOne(findData: Partial<UserEntity>, _authUser?: UserEntity): Promise<UserEntity> {
        return this.userRepository.findOne(findData);
    }

    findByEmailOrPhone(email, phone){
        return this.userRepository.findOne({
            where: [
                { email },
                { phone }
            ]
        });
    }

    findByEmailOrSSN(email, socialSecurityNumber){
        return this.userRepository.findOne({
            where: [
                { email },
                { socialSecurityNumber }
            ]
        });
    }

    async findById(id: string, authUser?: UserEntity): Promise<UserEntity> {
        const user = await this.findOne({id: id}, authUser);
     
        return user;
    }

    @Transaction()
    async registerUser(
        userRegisterDto: UserRegisterDto,
        _authUser? : UserEntity,
        @TransactionRepository(UserEntity) userRepository?: UserRepository
    ): Promise<UserEntity> {

        const user = userRepository.create(userRegisterDto);
        const createdUser = userRepository.save(user);

        return createdUser;
    }

    async createUser(
        userCreateDto: UserCreateDto
    ): Promise<UserEntity> {
        const user = this.userRepository.create(userCreateDto);
        return this.userRepository.save(user);
    }

    async getUsers(
        pageOptionsDto: UsersPageOptionsDto,
        authUser: UserEntity
    ): Promise<UsersPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        
        this.textSearch(queryBuilder, pageOptionsDto.q, ['user.firstName', 'user.lastName', 'user.email']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "user");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .andWhere('user.id != :id', {id: authUser.id})
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new UsersPageDto(items.toDtos(), pageMetaDto);
    }

    async getTesters(
        pageOptionsDto: UsersPageOptionsDto,
        authUser: UserEntity
    ): Promise<UsersPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        this.textSearch(queryBuilder, pageOptionsDto.q, ['user.firstName', 'user.lastName', 'user.email']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "user");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .andWhere('user.id != :id', {id: authUser.id})
            .andWhere('user.roles && :roles', {roles: [RoleType.ADMIN] })
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new UsersPageDto(items.toDtos(), pageMetaDto);
    }

    async getTestersTypeahead(
        pageOptionsDto: UsersPageOptionsDto,
        authUser: UserEntity
    ): Promise<UsersTypeaheadPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        this.textSearch(queryBuilder, pageOptionsDto.q, ['user.firstName', 'user.lastName', 'user.email']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "user");

        const query = queryBuilder
            .select(["user.id as id", "CONCAT(user.firstName, ' ', user.lastName, ' (', user.email,')') as name"])
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .andWhere('user.id != :id', {id: authUser.id})
            .andWhere('user.roles && :roles', {roles: [RoleType.ADMIN] });

        const items = await query.getRawMany();
        const total = await query.getCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });
        return new UsersTypeaheadPageDto(items, pageMetaDto);
    }

    async getUsersTypeahead(
        pageOptionsDto: UsersPageOptionsDto,
        authUser: UserEntity,
    ): Promise<UsersTypeaheadPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        
        this.textSearch(queryBuilder, pageOptionsDto.q, [
            'user.firstName',
            'user.lastName',
            'user.email',
        ]);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, 'user');

        const query = queryBuilder
            .select([
                'user.id as id',
                "CONCAT(user.firstName, ' ', user.lastName, ' (', user.email,')') as name",
            ])
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const items = await query.getRawMany();
        const total = await query.getCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });
        return new UsersTypeaheadPageDto(items, pageMetaDto);
    }


    async updateProfile(userData: UserUpdateDto, authUser?: UserEntity): Promise<UserEntity> {
        await this.userRepository.update(authUser.id, userData);

        return this.findById(authUser.id);
    }

    async updateUser(id: string, userData: UserUpdateDto, authUser?: UserEntity): Promise<UserEntity> {
        const initialUser = await this.findById(id, authUser);

        if (!initialUser) {
            throw new NotFoundException();
        }

        // if (authUser && authUser.hasRole(RoleType.ADMIN)) {
        //     if(initialUser.roles.length != 1 || !initialUser.hasRole(RoleType.USER)){
        //         throw new BadRequestException("You can only edit users with role USER.");
        //     }
        // }

        await this.userRepository.update(id, userData);

        return this.findById(id, authUser);
    }

    async deleteUser(id: string, authUser?: UserEntity): Promise<boolean> {
        const user = await this.findById(id, authUser);

        if (!user) {
            throw new NotFoundException();
        }
       
        await this.userRepository.softRemove({id: id, delete: true});

        return true;
    }

    async suspendUser(id: string, authUser?: UserEntity): Promise<boolean> {
        const user = await this.findById(id, authUser);

        if (!user) {
            throw new NotFoundException();
        }

        await this.userRepository.update(id,{
            suspendedAt: new Date().toISOString()
        });

        return true;
    }

    async unsuspendUser(id: string, authUser?: UserEntity): Promise<boolean> {
        const user = await this.findById(id, authUser);

        if (!user) {
            throw new NotFoundException();
        }

        await this.userRepository.update(id,{
            suspendedAt:null
        });

        return true;
    }
}
