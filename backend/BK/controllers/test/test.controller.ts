'use strict';

import {
    Body,
    Controller,
    Delete,
    Get,
    Header,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { TestDto } from './dto/Test.dto';
import { TestCreateDto } from './dto/TestCreate.dto';
import { TestsPageDto } from './dto/TestsPage.dto';
import { TestsPageOptionsDto } from './dto/TestsPageOptions.dto';
import { TestService } from './test.service';
import { TestUpdateDto } from './dto/TestUpdate.dto';
import { isArray, now } from 'lodash';
import { AuthUser } from 'decorators/auth-user.decorator';
import { NotFoundException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JobService } from '../job/job.service';
import { DeviceService } from '../device/device.service';
import { SampleService } from '../sample/sample.service';
import { nanoid } from 'nanoid';
import { PDFService } from '@t00nday/nestjs-pdf';
import * as moment from 'moment';
import 'moment-timezone';
import { ResultType } from '../../common/constants/result-type';
import { ConfigService } from 'shared/services/config.service';

@Controller('tests')
@ApiTags('tests')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class TestController {
    constructor(
        private _testService: TestService,
        private _customerService: CustomerService,
        private _userService: UserService,
        private _jobsService: JobService,
        private _deviceService: DeviceService,
        private _sampleService: SampleService,
        private _pdfService: PDFService,
        private _configService:ConfigService
        ) {}

    @Get('totalByState')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get tests total by state',
        type: TestsPageDto,
    })
    getTotalByState(
        @AuthUser() authUser: UserEntity
    ): Promise<any> {
        return this._testService.getTotalByState(authUser.toDto());
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get tests list',
        type: TestsPageDto,
    })
    getTests(
        @Query() pageOptionsDto: TestsPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<TestsPageDto> {
        return this._testService.getTests(pageOptionsDto, authUser);
    }

    @Post('')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER, RoleType.TESTER_MONITOR)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TestDto, description: 'Successfully Created' })
    async createTest(
        @Body() testDto: TestCreateDto,
        @AuthUser() authUser: UserEntity
        ): Promise<TestDto> {
        testDto.code = nanoid(10) + Number((now() / 1000).toFixed(0)).toString(16).substr(-4);
      
        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)) {
            testDto.customer = authUser.customer;
        }else if (authUser.hasRole(RoleType.ADMIN)) {
            if (testDto.customer) {
                testDto.customer = await this._customerService.findById(testDto.customer);
    
                if (!testDto.customer) {
                    throw new NotFoundException("Customer does not exist");
                }
            }
        }

        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR)){
            testDto.tester = authUser;
        } else {
            if (testDto.tester) {
                testDto.tester = await this._userService.findById(testDto.tester);
        
                if (!testDto.tester) {
                    throw new NotFoundException("Tester does not exist");
                }
            }
        }

        if (testDto.patient) {
            testDto.patient = await this._userService.findById(testDto.patient);
    
            if (!testDto.patient) {
                throw new NotFoundException("Patient does not exist");
            }
        }

        if (testDto.job) {
            testDto.job = await this._jobsService.findById(testDto.job);
    
            if (!testDto.job) {
                throw new NotFoundException("Job does not exist");
            }
        }

        if (testDto.sample) {
            testDto.sample = await this._sampleService.findById(testDto.sample);
    
            if (!testDto.sample) {
                throw new NotFoundException("Sample does not exist");
            }
        }

        const devices = [];
        if (testDto.devices) {
            if(!isArray(testDto.devices)){
                testDto.devices = [testDto.devices];
            }

            for (const deviceId of testDto.devices) {
                const device = await this._deviceService.findById(deviceId);
        
                if (!device) {
                    throw new NotFoundException("Device does not exist");
                }
                devices.push(device);
            }
        }

        testDto.timeInserted = testDto.timeInserted || new Date();

        if( testDto.result && testDto.timeInserted) {
            testDto.timeResult = testDto.time || testDto.timeInserted;
            testDto = this._testService.validateTestResult(testDto);
        }

        let createdTest = await this._testService.createTest(testDto);

        if (testDto.tester) {
            if(!createdTest.testers){
                createdTest.testers = [];
            }

            createdTest.testers.push(testDto.tester);
        }

        if (devices) {
            if(!createdTest.devices){
                createdTest.devices = [];
            }

            createdTest.devices = [...createdTest.devices, ...devices];
        }

        if (testDto.tester) {    
            createdTest = await this._testService.save(createdTest);
        }

        return createdTest.toDto();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TestDto, description: 'Requested test' })
    @ApiParam({ name: 'id', description: 'Test identifier', type: 'string' })
    async getTest(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity

        ): Promise<TestDto> {
        const test = await this._testService.findById(id, authUser);

        if (!test) {
            throw new NotFoundException();
        }

        return test.toDto();
    }

    @Get('/:id/pdf')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TestDto, description: 'Requested test pdf file' })
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=test.pdf') 
    @ApiParam({ name: 'id', description: 'Test identifier', type: 'string' })
    async getTestPdf(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity,
        @Res() res
        ): Promise<any> {
        const test = await this._testService.findById(id, authUser);
        if (!test) {
            throw new NotFoundException();
        }

        const stream = await this._pdfService.toStream('test-result', {
            locals: {
                avatar: `${this._configService.baseurl}${test.customer.avatar}`,
                ResultType: ResultType,
                dateResult: moment.utc(test.timeInserted).tz('America/New_York').format('MM/DD/YYYY'),
                timeResult: moment.utc(test.timeInserted).tz('America/New_York').format('h:mmA'),
                test: test.toDto()
            }
        }).toPromise();

        stream.pipe(res); 
    }

    @Get('/patient/:patientId')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.VERIFIER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TestDto, description: 'Last pacient test' })
    @ApiParam({ name: 'patientId', description: 'Test identifier', type: 'string' })
    async getTestByPacient(
        @Param('patientId') patientId: string,
        @AuthUser() authUser: UserEntity
        ): Promise<TestDto> {
        const test = await this._testService.findByPatient(patientId, authUser);

        if (!test) {
            throw new NotFoundException();
        }

        const lastTests = test.toDtos();

        if(!lastTests || !lastTests[0]){
            throw new NotFoundException();
        }

        return lastTests[0];
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TestDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Test identifier', type: 'string' })
    async updateTest(
        @Param('id') id: string,
        @Body() testDto: TestUpdateDto,
        @AuthUser() authUser: UserEntity
    ): Promise<TestDto> {
        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)) {
            delete testDto.customer;
        }else if (authUser.hasRole(RoleType.ADMIN)) {
            if (testDto.customer) {
                testDto.customer = await this._customerService.findById(testDto.customer);
    
                if (!testDto.customer) {
                    throw new NotFoundException("Customer does not exist");
                }
            }
        }

        if (testDto.patient) {
            testDto.patient = await this._userService.findById(testDto.patient);
    
            if (!testDto.patient) {
                throw new NotFoundException("Patient does not exist");
            }
        }

        if (testDto.job) {
            testDto.job = await this._jobsService.findById(testDto.job);
    
            if (!testDto.job) {
                throw new NotFoundException("Job does not exist");
            }
        }

        if (testDto.sample) {
            testDto.sample = await this._sampleService.findById(testDto.sample);
    
            if (!testDto.sample) {
                throw new NotFoundException("Sample does not exist");
            }
        }
        
        let tester = null;
        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR)){
            tester = authUser;
        } else {
            if (testDto.tester) {
                tester = await this._userService.findById(testDto.tester);
        
                if (!tester) {
                    throw new NotFoundException("Tester does not exist");
                }
            }
        }

        const devices = [];
        if (testDto.devices) {
            if(!isArray(testDto.devices)){
                testDto.devices = [testDto.devices];
            }

            for (const deviceId of testDto.devices) {
                const device = await this._deviceService.findById(deviceId);
        
                if (!device) {
                    throw new NotFoundException("Device does not exist");
                }
                devices.push(device);
            }
        }

        delete testDto.tester;
        delete testDto.devices;

        let sendResultEmail = false;
        if( testDto.result || testDto.time ) {
            const dbTest = await this._testService.findById(id, authUser);
            if(dbTest && testDto.result !== dbTest.result && !dbTest.result) {
                testDto.timeResult = testDto.time || new Date();
                testDto = this._testService.validateTestResult(testDto, dbTest.timeInserted);
                sendResultEmail = true;
            }
        }

        let updatedTest = await this._testService.updateTest(id, testDto, authUser);

        if (tester) {
            if(!updatedTest.testers){
                updatedTest.testers = [];
            }

            updatedTest.testers.push(tester);
        }

        if (devices) {
            if(!updatedTest.devices){
                updatedTest.devices = [];
            }

            updatedTest.devices = [...updatedTest.devices, ...devices];
        }

        if (tester || devices) {    
            updatedTest = await this._testService.save(updatedTest);
        }

        if(sendResultEmail){
            this._testService.sendTestResultEmail(updatedTest);
        }

        return updatedTest.toDto();
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Test identifier', type: 'string' })
    async deleteTest(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<boolean> {
        return this._testService.deleteTest(id, authUser);
    }
}
