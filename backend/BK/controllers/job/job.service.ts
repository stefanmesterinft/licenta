import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Brackets } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { JobsPageDto } from './dto/JobsPage.dto';
import { JobsPageOptionsDto } from './dto/JobsPageOptions.dto';
import { JobEntity } from './job.entity';
import { JobRepository } from './job.repository';
import { JobUpdateDto } from './dto/JobUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { JobCreateDto } from './dto/JobCreate.dto';
import { RoleType } from '../../common/constants/role-type';
import { JobsTypeaheadPageDto } from './dto/JobsTypeaheadPage.dto';

@Injectable()
export class JobService extends BaseService {
    constructor(
        public readonly jobRepository: JobRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {
        super();
    }

    protected _getRepository(): Repository<JobEntity> {
        return this.jobRepository;
    }

    /**
     * Find single job
     */
    findOne(findData: Partial<JobEntity>, authUser?: UserEntity): Promise<JobEntity> {
        if(authUser && authUser.customer && authUser.hasRole(RoleType.CLIENT)){
            findData.client = authUser.customer;
        }else if(authUser && authUser.customer){
            findData.customer = authUser.customer;
        }

        return this.jobRepository.findOne(findData, { 
            relations: ["customer", "client", "testers", "tests", "createdBy"]
        });
    }

    async findById(id: string, authUser?: UserEntity): Promise<JobEntity> {
        const job = await this.findOne({id: id}, authUser);

        return job;
    }

    async createJob(jobDto: JobCreateDto): Promise<JobEntity> {
        const job = this.jobRepository.create(jobDto);
        return this.jobRepository.save(job);
    }

    async getJobs(pageOptionsDto: JobsPageOptionsDto, authUser: UserEntity): Promise<JobsPageDto> {
        const queryBuilder = this.jobRepository.createQueryBuilder('job');

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

        if(authUser && authUser.hasRole(RoleType.TESTER_MONITOR, RoleType.TESTER)){
            queryBuilder.andWhere('testers.id = :tester_id', {
                tester_id: authUser.id,
            });
        }

        if(authUser && authUser.hasRole(RoleType.USER)){
            queryBuilder.andWhere('tests.patient_id = :patient_id', {
                patient_id: authUser.id,
            });
        }

        let searchFields = ['job.title', 'client.name', 'client.email', 'customer.name', 'customer.email'];

        if(authUser && authUser.hasRole(RoleType.TESTER,RoleType.TESTER_MONITOR,RoleType.TESTER_ADMIN)){
            searchFields = ['job.title', 'client.name', 'client.email'];
        }

        if(authUser && authUser.hasRole(RoleType.CLIENT)){
            searchFields = ['job.title', 'customer.name', 'customer.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "job");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("job.customer", "job.customer", "customer", "customer.id = job.customer_id")
            .leftJoinAndMapOne("job.client", "job.client", "client", "client.id = job.client_id")
            .leftJoinAndMapOne("job.createdBy", "job.createdBy", "createdBy", "createdBy.id = job.created_by_id")
            .leftJoinAndMapMany("job.testers", "job.testers", "testers")
            .loadRelationCountAndMap("job.totalTests", 'job.tests', 'testsTotal')
            .leftJoin("job.tests", 'tests')
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new JobsPageDto(items.toDtos(), pageMetaDto);
    }

    async getJobsTypeahead(pageOptionsDto: JobsPageOptionsDto, authUser: UserEntity): Promise<JobsTypeaheadPageDto> {
        const queryBuilder = this.jobRepository.createQueryBuilder('job');

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

        let searchFields = ['job.title', 'client.name', 'client.email', 'customer.name', 'customer.email'];

        if(authUser && authUser.hasRole(RoleType.TESTER,RoleType.TESTER_MONITOR,RoleType.TESTER_ADMIN)){
            searchFields = ['job.title', 'client.name', 'client.email'];
        }

        if(authUser && authUser.hasRole(RoleType.CLIENT)){
            searchFields = ['job.title', 'customer.name', 'customer.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "job");

        const query = queryBuilder
            .select(["job.id as id", "CONCAT(client.name, ' (', job.title, ')') as name"])
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoin("job.customer", "customer",  "customer.id = job.customer_id")
            .leftJoin("job.client", "client",  "client.id = job.client_id")
            .leftJoin("job.createdBy", "createdBy",  "createdBy.id = job.created_by_id");

        const items = await query.getRawMany();
        const total = await query.getCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });
        return new JobsTypeaheadPageDto(items, pageMetaDto);
    }

    async updateJob(id: string, jobData: JobUpdateDto, authUser?: UserEntity): Promise<JobEntity> {
        const initialJob = await this.findById(id, authUser);

        if (!initialJob) {
            throw new NotFoundException();
        }

        await this.jobRepository.save({id: id, ...jobData});

        return this.findById(id);
    }

    async save(job: JobEntity): Promise<JobEntity> {
        await this.jobRepository.save(job);

        return this.findById(job.id);
    }

    async deleteJob(id: string, authUser?: UserEntity): Promise<boolean> {
        const job = await this.findById(id, authUser);

        if (!job) {
            throw new NotFoundException();
        }

        await this.jobRepository.softRemove({id: id, delete: true});

        return true;
    }
}
