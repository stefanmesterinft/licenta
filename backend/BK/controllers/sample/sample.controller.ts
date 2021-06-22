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
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { SampleDto } from './dto/Sample.dto';
import { SampleCreateDto } from './dto/SampleCreate.dto';
import { SamplesPageDto } from './dto/SamplePage.dto';
import { SamplesPageOptionsDto } from './dto/SamplePageOptions.dto';
import { SampleService } from './sample.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CustomerService } from '../customer/customer.service';
import { SampleUpdateDto } from './dto/SampleUpdate.dto';
import { now } from 'lodash';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadStorageFilter } from '../../filters/upload-storage.filter';
import { UploadCsvFilter } from '../../filters/upload-filtype.filter';
import { SampleCheckInOutDto } from './dto/SampleCheckInOut.dto';
import { nanoid } from 'nanoid';


@Controller('samples')
@ApiTags('samples')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class SampleController {
    constructor(
        private _sampleService: SampleService,
        private _customerService: CustomerService,
        private _userService: UserService
        ) {}

    @Get('')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR, RoleType.TESTER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get samples list',
        type: SamplesPageDto,
    })
    getSamples(
        @Query() pageOptionsDto: SamplesPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<SamplesPageDto> {
        return this._sampleService.getSamples(pageOptionsDto, authUser);
    }

    @Get('mine')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get my checkout samples',
        type: SamplesPageDto,
    })
    getMySamples(
        @Query() pageOptionsDto: SamplesPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<SamplesPageDto> {
        return this._sampleService.getMySamples(pageOptionsDto, authUser);
    }

    @Get('/:barcode/isCheckedOut')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Object, description: 'Requested checkout sample' })
    @ApiParam({ name: 'barcode', description: 'Sample barcode', type: 'string' })
    async getIsCheckedoutSample(
        @Param('barcode') barcode: string,
        @AuthUser() authUser: UserEntity
        ): Promise<Object> {
        const sample = await this._sampleService.findOne({barcode: barcode}, authUser, true);

        if (!sample) {
            throw new NotFoundException();
        }

        const sampleDto = sample.toDto();
        return {
            checkedOut: sampleDto.assigned &&  sampleDto.assigned.id &&  sampleDto.assigned.id === authUser.id ? sampleDto.assigned &&  sampleDto.assigned.id && sampleDto.assigned.id === authUser.id : false
        };
    }

    @Post('')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: SampleDto, description: 'Successfully Created' })
    async createSample(
        @Body() sampleDto: SampleCreateDto,
        @AuthUser() authUser: UserEntity): Promise<SampleDto> {

        if(!sampleDto.barcode){
            sampleDto.barcode = nanoid(10) + Number((now() / 1000).toFixed(0)).toString(16).substr(-4);
        }

        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)) {
            sampleDto.customer = authUser.customer;
        }else{
            if (sampleDto.customer) {
                sampleDto.customer = await this._customerService.findById(sampleDto.customer);
        
                if (!sampleDto.customer) {
                    throw new NotFoundException("Customer does not exist");
                }
            }
        }
       
        if (sampleDto.assigned) {
            sampleDto.assigned = await this._userService.findById(sampleDto.assigned);
    
            if (!sampleDto.assigned) {
                throw new NotFoundException("User does not exist");
            }
        }

        const createdSample = await this._sampleService.createSample(sampleDto);
        return createdSample.toDto();
    }

    @Get('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR, RoleType.TESTER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: SampleDto, description: 'Requested sample' })
    @ApiParam({ name: 'id', description: 'Sample identifier', type: 'string' })
    async getSample(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<SampleDto> {
        const sample = await this._sampleService.findById(id, authUser);

        if (!sample) {
            throw new NotFoundException();
        }

        return sample.toDto();
    }

    @Put('/checkout')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR )
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: SampleDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async sampleCheckout(
        @Body() data: SampleCheckInOutDto,
        @AuthUser() authUser: UserEntity): Promise<any> {
           
        const queryData = {...data};
        delete queryData.location;

        const sample = await this._sampleService.findOne(queryData, authUser, true);
        
        if(!sample){
            throw new BadRequestException("Sample not found");
        }

        if(sample.assigned && sample.assigned.id != authUser.id){
            throw new BadRequestException("error.sample.already_checked_out_by_other");
        }

        if(sample.assigned && sample.assigned.id === authUser.id){
            throw new BadRequestException("error.sample.already_checked_out_by_you");
        }

        const updateSample = new SampleUpdateDto();
        updateSample.assigned = authUser;
        updateSample.location = data.location;

        const updatedSample = await this._sampleService.updateSample(sample.id, updateSample, authUser, true);        

        return updatedSample.toDto();
    }

    @Put('/checkin')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR )
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: SampleDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async sampleCheckin(
        @Body() data: SampleCheckInOutDto,
        @AuthUser() authUser: UserEntity): Promise<any> {
           
        const queryData = {...data};
        delete queryData.location;

        const sample = await this._sampleService.findOne(queryData, authUser);
        
        if(!sample){
            throw new BadRequestException("Sample not found");
        }

        const updateSample = new SampleUpdateDto();
        updateSample.assigned = null;
        updateSample.location = data.location;

        const updatedSample = await this._sampleService.updateSample(sample.id, updateSample, authUser, true);        

        return updatedSample.toDto();
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR, RoleType.TESTER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: SampleDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Sample identifier', type: 'string' })
    async updateSample(
        @Param('id') id: string,
        @Body() sampleDto: SampleUpdateDto,
        @AuthUser() authUser: UserEntity): Promise<SampleDto> {
        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)) {
            delete sampleDto.customer;
        }else{
            if (sampleDto.customer) {
                sampleDto.customer = await this._customerService.findById(sampleDto.customer);
        
                if (!sampleDto.customer) {
                    throw new NotFoundException("Customer does not exist");
                }
            }
        }
       
        if (sampleDto.assigned) {
            sampleDto.assigned = await this._userService.findById(sampleDto.assigned);
    
            if (!sampleDto.assigned) {
                throw new NotFoundException("User does not exist");
            }
        }

        const updatedSample = await this._sampleService.updateSample(id, sampleDto, authUser);
        
        return updatedSample.toDto();
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Sample identifier', type: 'string' })
    async deleteSample(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._sampleService.deleteSample(id, authUser);
    }

    @Post('/import')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Updated' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('temp', {
            storage: UploadStorageFilter(),
            fileFilter: UploadCsvFilter
        })
    )
    async import(
        @UploadedFile() file,
        @AuthUser() authUser: UserEntity
    ): Promise<Boolean> {
        if (file) {
            const parsed = await this._sampleService.importer(file);
        }

        return true;
    }
}
