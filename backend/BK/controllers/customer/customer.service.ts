import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CustomerEntity } from './customer.entity';
import { CustomerRepository } from './customer.repository';
import { CustomerCreateDto } from './dto/CustomerCreate.dto';
import { CustomersPageDto } from './dto/CustomersPage.dto';
import { CustomersPageOptionsDto } from './dto/CustomersPageOptions.dto';
import { UserEntity } from '../user/user.entity';
import { RoleType } from '../../common/constants/role-type';
import { CustomerUpdateDto } from './dto/CustomerUpdate.dto';
import { CustomersTypeaheadPageDto } from './dto/CustomersTypeaheadPage.dto';
import { CustomersMembersPageDto } from './dto/CustomersMembersPage.dto';
import { CustomerType } from '../../common/constants/customer-type';

@Injectable()
export class CustomerService extends BaseService {
    constructor(
        public readonly customerRepository: CustomerRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {
        super();
    }

    protected _getRepository(): Repository<CustomerEntity> {
        return this.customerRepository;
    }

    /**
     * Find single customer
     */
    findOne(findData: Partial<CustomerEntity>): Promise<CustomerEntity> {
        return this.customerRepository.findOne(findData);
    }

    async findById(id: string): Promise<CustomerEntity> {
        const customer = await this.findOne({id: id});

        return customer;
    }

    async createCustomer(
        customerDto: CustomerCreateDto
    ): Promise<CustomerEntity> {
        const customer = this.customerRepository.create(customerDto);
        return this.customerRepository.save(customer);
    }

    async getCustomers(
        pageOptionsDto: CustomersPageOptionsDto
    ): Promise<CustomersPageDto> {
        const queryBuilder = this.customerRepository.createQueryBuilder('customer');

        this.textSearch(queryBuilder, pageOptionsDto.q, ['customer.name', 'customer.email']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "customer");
        
        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });

     
        return new CustomersPageDto(items.toDtos(), pageMetaDto);
    }

    async getCustomersByJobsTypeahead(
        pageOptionsDto: CustomersPageOptionsDto,
        authUser?: UserEntity
    ): Promise<CustomersTypeaheadPageDto> {
        const queryBuilder = this.customerRepository.createQueryBuilder('customer');

        this.textSearch(queryBuilder, pageOptionsDto.q, ['customer.name', 'customer.email']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "customer");  
        
        const query = queryBuilder
            .select(["customer.id as id", "CONCAT(customer.name, ' (' , customer.email, ')') as name"])
            .innerJoin("jobs", "job", "job.client_id = customer.id or job.customer_id = customer.id")
            .leftJoin("tests", "test", "test.job_id = job.id")
            .groupBy("customer.id")
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        if(authUser && authUser.hasRole(RoleType.TESTER, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR)){
            if(authUser.customer){
                queryBuilder.andWhere('job.customer_id = :customer_id', {
                    customer_id: authUser.customer.id,
                });
            }
        }

        if(authUser && authUser.hasRole(RoleType.CLIENT)){
            if(authUser.customer){
                queryBuilder.andWhere('job.client_id = :client_id', {
                    client_id: authUser.customer.id,
                });
            }
        }

        if(authUser && authUser.hasRole(RoleType.USER)){
            queryBuilder.andWhere('test.patient_id = :patient_id', {
                patient_id: authUser.id,
            });
            queryBuilder.andWhere('(test.customer_id = customer.id or customer.type != :type)', {
                type: CustomerType.TESTER
            });
        }
        

        if(authUser && authUser.hasRole(RoleType.TESTER_MONITOR, RoleType.TESTER)){
            queryBuilder
                .innerJoin("jobs_testers_users", "testers", "testers.jobs_id = job.id")
                .andWhere('testers.users_id = :tester_id', {
                    tester_id: authUser.id,
                });
        }
    
        const items = await query.getRawMany();
        const total = await query.getCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });

     
        return new CustomersTypeaheadPageDto(items, pageMetaDto);
    }

    async getCustomersTypeahead(
        pageOptionsDto: CustomersPageOptionsDto
    ): Promise<CustomersTypeaheadPageDto> {
        const queryBuilder = this.customerRepository.createQueryBuilder('customer');

        this.textSearch(queryBuilder, pageOptionsDto.q, ['customer.name', 'customer.email']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "customer");
        
        const query = queryBuilder
            .select(["customer.id as id", "CONCAT(customer.name, ' (' , customer.email, ')') as name"])
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
    
        const items = await query.getRawMany();
        const total = await query.getCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });

     
        return new CustomersTypeaheadPageDto(items, pageMetaDto);
    }

    async updateCustomer(
        id: string,
        customerData: CustomerUpdateDto,
    ): Promise<CustomerEntity> {
        const initialCustomer = await this.findById(id);

        if (!initialCustomer) {
            throw new NotFoundException();
        }

        await this.customerRepository.save({id: id, ...customerData});

        return this.customerRepository.findOne(id);
    }

    async deleteCustomer(id: string): Promise<boolean> {
        const customer = await this.findById(id);

        if (!customer) {
            throw new NotFoundException();
        }

        await this.customerRepository.softRemove({id: id, delete: true});

        return true;
    }


    async getMembers(
        id: string,
        pageOptionsDto: CustomersPageOptionsDto
    ): Promise<CustomersMembersPageDto> {
        const queryBuilder = this.customerRepository.manager.createQueryBuilder(UserEntity, 'user');

        queryBuilder.andWhere('user.customer_id = :customer_id', {
            customer_id: id,
        });

        queryBuilder.andWhere('user.roles && :roles', {roles: [RoleType.TESTER_ADMIN, RoleType.CLIENT] })

        this.textSearch(queryBuilder, pageOptionsDto.q, ['user.name', 'user.email']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "user");

        const [items, total] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();
        
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });

     
        return new CustomersMembersPageDto(items.toDtos(), pageMetaDto);
    }

    async suspendCustomer(id: string): Promise<boolean> {
        const customer = await this.findById(id);

        if (!customer) {
            throw new NotFoundException();
        }

        await this.customerRepository.update(id,{
            suspendedAt: new Date().toISOString()
        });

        return true;
    }

    async unsuspendCustomer(id: string): Promise<boolean> {
        const customer = await this.findById(id);

        if (!customer) {
            throw new NotFoundException();
        }

        await this.customerRepository.update(id,{
            suspendedAt:null
        });

        return true;
    }
}
