'use strict';

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { Roles, RolesAllExcept } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { JobDto } from './dto/Job.dto';
import { JobCreateDto } from './dto/JobCreate.dto';
import { JobsPageDto } from './dto/JobsPage.dto';
import { JobsPageOptionsDto } from './dto/JobsPageOptions.dto';
import { JobService } from './job.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { JobEntity } from './job.entity';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CustomerService } from '../customer/customer.service';
import { JobUpdateDto } from './dto/JobUpdate.dto';
import { JobsTypeaheadPageDto } from './dto/JobsTypeaheadPage.dto';

@Controller('jobs')
@ApiTags('jobs')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class JobController {
    constructor(
        private _jobService: JobService,
        private _customerService: CustomerService,
        private _userService: UserService
        ) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get jobs list',
        type: JobsPageDto,
    })
    getJobs(
        @Query() pageOptionsDto: JobsPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<JobsPageDto> {
        return this._jobService.getJobs(pageOptionsDto, authUser);
    }

    @Get('/typeahead')
    @RolesAllExcept(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get jobs typehead',
        type: JobsPageDto,
    })
    getJobsTypeahead(
        @Query() pageOptionsDto: JobsPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<JobsTypeaheadPageDto> {
        return this._jobService.getJobsTypeahead(pageOptionsDto, authUser);
    }

    @Post('')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.CLIENT)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: JobDto, description: 'Successfully Created' })
    async createJob(
        @Body() jobDto: JobCreateDto,
        @AuthUser() authUser: UserEntity): Promise<JobDto> {
        if (authUser.hasRole(RoleType.TESTER_ADMIN)) {
            jobDto.customer = authUser.customer;
        }else if (authUser.hasRole(RoleType.ADMIN)) {
            if (jobDto.customer) {
                jobDto.customer = await this._customerService.findById(jobDto.customer);
        
                if (!jobDto.customer) {
                    throw new NotFoundException("Client does not exist");
                }
            }
        }

        if (authUser.hasRole(RoleType.CLIENT)) {
            jobDto.client = authUser.customer;
        } else if (authUser.hasRole(RoleType.ADMIN, RoleType.TESTER_ADMIN)) {
            if (jobDto.client) {
                jobDto.client = await this._customerService.findById(jobDto.client);
            }
        }

        if (!jobDto.client) {
            throw new BadRequestException("Missing client information");
        }


        if(!jobDto.startDate){
            jobDto.startDate = new Date();
        }

        if(!jobDto.endDate){
            jobDto.endDate = jobDto.startDate;
        }

        jobDto.createdBy = authUser;
      
        const createdJob = await this._jobService.createJob(jobDto);
        return createdJob.toDto();
    }

    @Get('/:id')
    @RolesAllExcept(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: JobDto, description: 'Requested job' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async getJob(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<JobDto> {
        const job = await this._jobService.findById(id, authUser);

        if (!job) {
            throw new NotFoundException();
        }

        return job.toDto();
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.CLIENT)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: JobDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async updateJob(
        @Param('id') id: string,
        @Body() jobDto: JobUpdateDto,
        @AuthUser() authUser: UserEntity): Promise<JobDto> {
        if (authUser.hasRole(RoleType.ADMIN)) {
            if (jobDto.customer) {
                jobDto.customer = await this._customerService.findById(jobDto.customer);
        
                if (!jobDto.customer) {
                    throw new NotFoundException("Client does not exist");
                }
            }
        }else{
            delete jobDto.customer;
        }

        if (authUser.hasRole(RoleType.CLIENT)) {
            delete jobDto.client;
        } else if (authUser.hasRole(RoleType.ADMIN, RoleType.TESTER_ADMIN)) {
            if (jobDto.client) {
                jobDto.client = await this._customerService.findById(jobDto.client);

                if (!jobDto.client) {
                    throw new BadRequestException("Missing client information");
                }
            }
        }

        const updatedJob = await this._jobService.updateJob(id, jobDto, authUser);        
        return updatedJob.toDto();
    }

    @Put('/:jobId/assign/tester/:testerId')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: JobDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async assignTester(
        @Param('jobId') jobId: string,
        @Param('testerId') testerId: string,
        @AuthUser() authUser: UserEntity): Promise<JobDto> {
       
        const job = await this._jobService.findById(jobId, authUser);
        if (!job) {
            throw new BadRequestException("Job does not exist");
        }


        const tester = await this._userService.findById(testerId);
        if (!tester) {
            throw new BadRequestException("Tester does not exist");
        }


        job.testers.push(tester);

        const updatedJob = await this._jobService.save(job);        
        return updatedJob.toDto();
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN, RoleType.CLIENT, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async deleteJob(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._jobService.deleteJob(id, authUser);
    }
}
