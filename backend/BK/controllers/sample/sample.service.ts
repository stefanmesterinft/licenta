import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Any, Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { SamplesPageDto } from './dto/SamplePage.dto';
import { SamplesPageOptionsDto } from './dto/SamplePageOptions.dto';
import { SampleEntity } from './sample.entity';
import { SampleRepository } from './sample.repository';
import { SampleUpdateDto } from './dto/SampleUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { SampleDto } from './dto/Sample.dto';
import { SampleCreateDto } from './dto/SampleCreate.dto';
import { RoleType } from '../../common/constants/role-type';
import { createReadStream, existsSync } from 'fs';
import { CsvParser } from 'nest-csv-parser';
import { join } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class SampleService extends BaseService {
    constructor(
        public readonly sampleRepository: SampleRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
        private readonly csvParser: CsvParser
    ) {
        super();
    }

    protected _getRepository(): Repository<SampleEntity> {
        return this.sampleRepository;
    }

    /**
     * Find single sample
     */
    findOne(findData: Partial<SampleEntity>, authUser?: UserEntity, skipAssigned?: Boolean): Promise<SampleEntity> {
        const customer: any= {};
        const renter: any = {};

        if(authUser && authUser.customer){
           customer.customer = authUser.customer;
           renter.renter = authUser.customer;
        }

        if(!skipAssigned && authUser && authUser.hasRole(RoleType.TESTER_MONITOR, RoleType.TESTER)){
            customer.assigned = Any([authUser.id, null]);
            renter.assigned = Any([authUser.id, null]);
        }

        return this.sampleRepository.findOne( { 
            where :  [
                {
                    ...customer,
                    ...findData
                },
                {
                    ...renter,
                    ...findData
                },
            ],
            relations: ["customer","renter","assigned"]
        });
    }

    async findById(id: string, authUser?: UserEntity): Promise<SampleEntity> {
        const sample = await this.findOne({id: id}, authUser);

        return sample;
    }

    async createSample(sampleDto: SampleCreateDto): Promise<SampleEntity> {
        const sample = this.sampleRepository.create(sampleDto);
        return this.sampleRepository.save(sample);
    }

    async getSamples(pageOptionsDto: SamplesPageOptionsDto, authUser: UserEntity): Promise<SamplesPageDto> {
        const queryBuilder = this.sampleRepository.createQueryBuilder('sample');

        if(authUser && authUser.customer){
            queryBuilder.andWhere('(sample.customer_id = :customer_id OR sample.renter_id = :customer_id)', {
                customer_id: authUser.customer.id,
            });
        }

        /*
        if(authUser && authUser.hasRole(RoleType.TESTER_MONITOR, RoleType.TESTER)){
            queryBuilder.andWhere('(sample.assigned_id = :assigned_id OR sample.assigned_id is NULL)', {
                assigned_id: authUser.id,
            });
        }
        */

        let searchFields = ['sample.identifier', 'sample.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email',  'renter.name', 'renter.email', 'customer.name', 'customer.email'];

        if(authUser && authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)){
            searchFields = ['sample.identifier', 'sample.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "sample");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("sample.customer", "sample.customer", "customer", "customer.id = sample.customer_id")
            .leftJoinAndMapOne("sample.assigned", "sample.assigned", "assigned", "assigned.id = sample.assigned_id")
            .leftJoinAndMapOne("sample.renter", "sample.renter", "renter", "renter.id = sample.renter_id")
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new SamplesPageDto(items.toDtos(), pageMetaDto);
    }


    async getMySamples(pageOptionsDto: SamplesPageOptionsDto, authUser: UserEntity): Promise<SamplesPageDto> {
        const queryBuilder = this.sampleRepository.createQueryBuilder('sample');

        queryBuilder.andWhere('(sample.customer_id = :customer_id OR sample.renter_id = :customer_id)', {
            customer_id: authUser.customer.id,
        })
        .andWhere('sample.assigned_id = :assigned_id', {
            assigned_id: authUser.id,
        });


        let searchFields = ['sample.identifier', 'sample.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email',  'renter.name', 'renter.email', 'customer.name', 'customer.email'];

        if(authUser && authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)){
            searchFields = ['sample.identifier', 'sample.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "sample");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("sample.customer", "sample.customer", "customer", "customer.id = sample.customer_id")
            .leftJoinAndMapOne("sample.assigned", "sample.assigned", "assigned", "assigned.id = sample.assigned_id")
            .leftJoinAndMapOne("sample.renter", "sample.renter", "renter", "renter.id = sample.renter_id")
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new SamplesPageDto(items.toDtos(), pageMetaDto);
    }

    async updateSample(id: string, sampleData: SampleUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<SampleEntity> {
        if(!skipFind){
            const initialSample = await this.findById(id, authUser);

            if (!initialSample) {
                throw new NotFoundException();
            }
        }

        await this.sampleRepository.save({id: id, ...sampleData});

        return this.findById(id);
    }

    async deleteSample(id: string, authUser?: UserEntity): Promise<boolean> {
        const sample = await this.findById(id, authUser);

        if (!sample) {
            throw new NotFoundException();
        }

        await this.sampleRepository.softRemove({id: id, delete: true});

        return true;
    }

    async importer(file: any): Promise<boolean> {
        const imported = await this.defaultImporter(this.csvParser, SampleEntity, file);
     
        return imported;
    }
}
