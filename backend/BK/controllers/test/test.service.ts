import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { TestsPageDto } from './dto/TestsPage.dto';
import { TestsPageOptionsDto } from './dto/TestsPageOptions.dto';
import { TestEntity } from './test.entity';
import { TestRepository } from './test.repository';
import { TestUpdateDto } from './dto/TestUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { TestCreateDto } from './dto/TestCreate.dto';
import { RoleType } from 'common/constants/role-type';
import { UserDto } from '../user/dto/User.dto';
import { JobEntity } from '../job/job.entity';
import * as moment from 'moment';
import { ResultType } from '../../common/constants/result-type';
import { ConfigService } from '../../shared/services/config.service';
import { AwsSesService } from '../../shared/services/aws-ses.service';

@Injectable()
export class TestService extends BaseService {
    constructor(
        public readonly testRepository: TestRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
        public readonly awsSesService: AwsSesService,
        public readonly configService: ConfigService
    ) {
        super();
    }

    protected _getRepository(): Repository<TestEntity> {
        return this.testRepository;
    }

    /**
     * Find single test
     */
    findOne(findData: Partial<TestEntity>, authUser?: UserEntity): Promise<TestEntity> {
        if(authUser && authUser.customer &&  authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)){
            findData.customer = authUser.customer;
        }

        if(authUser && authUser.hasRole(RoleType.CLIENT)){
            if(authUser && authUser.customer){
                findData.job.client = authUser.customer;
            }
        }

        return this.testRepository.findOne(findData, { 
            relations: ["customer", "patient", "job", "testers", "devices", "sample", "job.client", "job.createdBy"]
        });
    }

    async findByPatient(patientId: string, authUser?: UserEntity): Promise<TestEntity[]> {
        const where: any = {
            patient: patientId,
            result: Not(IsNull())
        };
        if(authUser && authUser.customer &&  authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)){
            where.customer = authUser.customer;
        }

        if(authUser && authUser.hasRole(RoleType.CLIENT)){
            if(authUser && authUser.customer){
                where.job.client = authUser.customer;
            }
        }
         // excluded for now because verifier don't need this. "customer", "job", "devices", "testers", "job.client", "job.createdBy"
        return this.testRepository.find({
            where: where,
            relations: [ "patient", "sample"],
            order: {
                createdAt: 'DESC'
            },
            take: 1
        });
    }

    async findById(id: string, authUser?: UserEntity): Promise<TestEntity> {
        const test = await this.findOne({id: id}, authUser);

        return test;
    }

    async createTest(testDto: TestCreateDto): Promise<TestEntity> {
        const test = this.testRepository.create(testDto);
        return this.testRepository.save(test);
    }

    async getTests(pageOptionsDto: TestsPageOptionsDto, authUser: UserEntity): Promise<TestsPageDto> {
        const queryBuilder = this.testRepository.createQueryBuilder('test');

        if(authUser && authUser.customer && authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)){
            queryBuilder.andWhere('test.customer_id = :customer_id', {
                customer_id: authUser.customer.id,
            });
        }

        if(authUser && authUser.customer && authUser.hasRole(RoleType.CLIENT)){
            queryBuilder.andWhere('job.client_id = :client_id', {
                client_id: authUser.customer.id,
            });
        }

        if(authUser && authUser.hasRole(RoleType.USER)){
            queryBuilder.andWhere('test.patient_id = :patient_id', {
                patient_id: authUser.id,
            });
        }

        if(authUser && authUser.hasRole(RoleType.TESTER)){
            queryBuilder.andWhere('(jobTesters.id = :tester_id or testers.id = :tester_id)', {
                tester_id: authUser.id,
            });
        }

        if(authUser && authUser.hasRole(RoleType.TESTER_MONITOR)){
            queryBuilder.andWhere('(jobTesters.id = :tester_id or testers.id = :tester_id)', {
                tester_id: authUser.id,
            });

            if(!pageOptionsDto.skipNullResult){
                queryBuilder.andWhere('test.result is NULL', {
                    tester_id: authUser.id,
                });
            }
        }

        let searchFields = ['test.code', 'client.name', 'client.email', 'customer.name', 'customer.email', 'patient.firstName', 'patient.lastName' , 'patient.email'];

        if(authUser && authUser.hasRole(RoleType.TESTER,RoleType.TESTER_MONITOR,RoleType.TESTER_ADMIN)){
            searchFields = ['test.code', 'client.name', 'client.email', 'patient.firstName', 'patient.lastName' , 'patient.email'];
        }

        if(authUser && authUser.hasRole(RoleType.CLIENT)){
            searchFields = ['test.code', 'customer.name', 'customer.email', 'patient.firstName', 'patient.lastName' , 'patient.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "test");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("test.customer", "test.customer", "customer", "customer.id = test.customer_id")
            .leftJoinAndMapOne("test.patient", "test.patient", "patient", "patient.id = test.patient_id")
            .leftJoinAndMapOne("test.job", "test.job", "job", "job.id = test.job_id")
            .leftJoinAndMapOne("test.sample", "test.sample", "sample", "sample.id = test.sample_id")
            .leftJoinAndMapOne("job.client", "job.client", "client", "client.id = job.client_id")
            .leftJoinAndMapOne("job.createdBy", "job.createdBy", "jobCreatedBy", "jobCreatedBy.id = job.created_by_id")
            .leftJoinAndMapMany("test.testers", "test.testers", "testers")
            .leftJoinAndMapMany("test.devices", "test.devices", "devices")
            .leftJoin("job.testers", "jobTesters")
            .orderBy("test.createdAt", "DESC")
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new TestsPageDto(items.toDtos(), pageMetaDto);
    }

    async updateTest(id: string, testData: TestUpdateDto, authUser?: UserEntity): Promise<TestEntity> {
        const initialTest = await this.findById(id, authUser);

        if (!initialTest) {
            throw new NotFoundException();
        }

        await this.testRepository.save({id: id, ...testData});

        return this.findById(id);
    }

    async save(test: TestEntity): Promise<TestEntity> {
        await this.testRepository.save(test);

        return this.findById(test.id);
    }


    async deleteTest(id: string, authUser?: UserEntity): Promise<boolean> {
        const test = await this.findById(id, authUser);

        if (!test) {
            throw new NotFoundException();
        }

        await this.testRepository.softRemove({id: id, delete: true});

        return true;
    }

    async getTotalsByUser(user: UserDto){
        const queryBuilder = this.testRepository.createQueryBuilder('test');

        if(user.hasRole(RoleType.USER)){
            queryBuilder.where('test.patient_id = :patient_id', {patient_id: user.id})
        }

        if(user.hasRole(RoleType.TESTER)){
            queryBuilder.leftJoin("test.testers", "testers")
            queryBuilder.where('testers.id = :tester_id', {tester_id:  user.id})
        }

        if(user.customer && user.hasRole(RoleType.CLIENT)){
            queryBuilder.leftJoin("test.job", "job")
            queryBuilder.where('job.client_id = :client_id', {client_id:  user.customer.id})
        }

        if(user.customer && !user.hasRole(RoleType.CLIENT)){
            queryBuilder.where('test.customer_id = :customer_id', {customer_id:  user.customer.id})
        }
    
        const totals = await queryBuilder.select([
            "count(*) FILTER (WHERE test.result is NULL) AS pending",
            "count(*) FILTER (WHERE UPPER(test.result) = 'POSITIVE') AS positive",
            "count(*) FILTER (WHERE UPPER(test.result) = 'NEGATIVE') AS negative",
            "count(*) FILTER (WHERE UPPER(test.result) = 'RETEST') AS retest",
            "count(*) AS total_tests",
        ])
        .getRawOne();


        const queryBuilder2 = this.testRepository.manager.createQueryBuilder(JobEntity, "job")

        if(user.hasRole(RoleType.TESTER)){
            queryBuilder2.leftJoin("job.testers", "testers")
            queryBuilder2.where('testers.id = :tester_id', {tester_id:  user.id})
        }

        if(user.customer && user.hasRole(RoleType.CLIENT)){
            queryBuilder2.where('job.client_id = :client_id', {client_id:  user.customer.id})
        }

        if(user.customer && !user.hasRole(RoleType.CLIENT)){
            queryBuilder2.where('job.customer_id = :customer_id', {customer_id:  user.customer.id})
        }

        const totalsJobs = await queryBuilder2.select([
            "SUM(job.estimatedTests) as total_estimated_tests",
            "count(*) AS total_jobs",
        ])
        .getRawOne();

        return {...totals, ...totalsJobs};
    }


    async getTotalByState(user: UserDto){
        return {};
        
        // DISABLED BECAUSE OF CPU INTENSIVE WORK. HAVE TO BE REFECATORED.
        const queryBuilder = this.testRepository.createQueryBuilder('test');
        queryBuilder.leftJoin('states', 'state', 'ST_Intersects(test.location, state.geom)')
        queryBuilder.leftJoin('countries', 'country', 'ST_Intersects(test.location, country.geom)')

        if(user.hasRole(RoleType.USER)){
            queryBuilder.where('test.patient_id = :patient_id', {patient_id: user.id})
        }

        if(user.hasRole(RoleType.TESTER)){
            queryBuilder.leftJoin("test.testers", "testers")
            queryBuilder.where('testers.id = :tester_id', {tester_id:  user.id})
        }

        if(user.customer && user.hasRole(RoleType.CLIENT)){
            queryBuilder.leftJoin("test.job", "job")
            queryBuilder.where('job.client_id = :client_id', {client_id:  user.customer.id})
        }

        if(user.customer && !user.hasRole(RoleType.CLIENT)){
            queryBuilder.where('test.customer_id = :customer_id', {customer_id:  user.customer.id})
        }       

        const totals = await queryBuilder.select([
            "state.name as state",
            "country.name as country",
            "country.iso2 as country_iso",
            "count(*) FILTER (WHERE test.result is NULL) AS pending",
            "count(*) FILTER (WHERE UPPER(test.result) = 'POSITIVE') AS positive",
            "count(*) FILTER (WHERE UPPER(test.result) = 'NEGATIVE') AS negative",
            "count(*) FILTER (WHERE UPPER(test.result) = 'RETEST') AS retest",
            "count(*) AS total_tests",
        ])
        .groupBy("state.name, country.name, country.iso2")
        .orderBy("total_tests", "DESC")
        .getRawMany();

        return totals;
    }

    validateTestResult(testDto: TestUpdateDto | TestCreateDto, timeInserted?): any {
        if( testDto.result == ResultType.NEGATIVE){
            const timeResult = moment(testDto.timeResult);
            const timePassedUntilResultReceived = timeResult.diff(moment(timeInserted || testDto.timeInserted), 'minutes');

            // If A NEGATIVE test removed from incubation before 15 minutes or after 30 minutes then the test should be invalid 
            if(timePassedUntilResultReceived < 15 || timePassedUntilResultReceived > 30){
                testDto.result = ResultType.RETEST;
                if(timePassedUntilResultReceived < 15){
                    testDto.reason = "Incubation time was less then 15 minutes";
                } else  if(timePassedUntilResultReceived > 30){
                    testDto.reason = "Incubation time was more then 30 minutes";
                }
            }else {
                testDto.reason = testDto.reason || null;
            }
        }

        return testDto;
    }


    async sendTestResultEmail(test){
        if(!test.patient || !test.patient.email){
            return false;
        }

        let mailOptions = {
            to: test.patient.email,
            subject: 'Your test results are ready',
            text: 'Thank you for participating in your recent test with us. Please login to the portal to get your results.',
            html: `Hi ${test.patient.firstName} ${test.patient.lastName}! <br><br> Thank you for participating in your recent test with us.<br/>
            <a href="${this.configService.frontendUrl}"> Please click here and login to the portal to get your results. </a>`
        };

        const sent = await this.awsSesService.sendEmail(mailOptions);
        return !!sent;
    }
}
