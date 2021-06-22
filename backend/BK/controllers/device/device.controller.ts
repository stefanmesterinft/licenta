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
import { DeviceDto } from './dto/Device.dto';
import { DeviceCreateDto } from './dto/DeviceCreate.dto';
import { DevicesPageDto } from './dto/DevicesPage.dto';
import { DevicesPageOptionsDto } from './dto/DevicesPageOptions.dto';
import { DeviceService } from './device.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CustomerService } from '../customer/customer.service';
import { DeviceUpdateDto } from './dto/DeviceUpdate.dto';
import { now } from 'lodash';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadStorageFilter } from '../../filters/upload-storage.filter';
import { UploadCsvFilter } from '../../filters/upload-filtype.filter';
import { DeviceCheckInOutDto } from './dto/DeviceCheckInOut.dto';
import { nanoid } from 'nanoid';


@Controller('devices')
@ApiTags('devices')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeviceController {
    constructor(
        private _deviceService: DeviceService,
        private _customerService: CustomerService,
        private _userService: UserService
        ) {}

    @Get('')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR, RoleType.TESTER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get devices list',
        type: DevicesPageDto,
    })
    getDevices(
        @Query() pageOptionsDto: DevicesPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<DevicesPageDto> {
        return this._deviceService.getDevices(pageOptionsDto, authUser);
    }


    @Get('mine')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get my checkout devices',
        type: DevicesPageDto,
    })
    getMyDevices(
        @Query() pageOptionsDto: DevicesPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<DevicesPageDto> {
        return this._deviceService.getMyDevices(pageOptionsDto, authUser);
    }

    @Get('/:barcode/isCheckedOut')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Object, description: 'Requested checkout device' })
    @ApiParam({ name: 'barcode', description: 'Device barcode', type: 'string' })
    async getIsCheckedoutDevice(
        @Param('barcode') barcode: string,
        @AuthUser() authUser: UserEntity
        ): Promise<Object> {
        const device = await this._deviceService.findOne({barcode: barcode}, authUser, true);

        if (!device) {
            throw new NotFoundException();
        }

        const deviceDto = device.toDto();

        return {
            checkedOut: deviceDto.assigned &&  deviceDto.assigned.id &&  deviceDto.assigned.id === authUser.id ? deviceDto.assigned &&  deviceDto.assigned.id && deviceDto.assigned.id === authUser.id : false
        };
    }

    @Post('')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: DeviceDto, description: 'Successfully Created' })
    async createDevice(
        @Body() deviceDto: DeviceCreateDto,
        @AuthUser() authUser: UserEntity): Promise<DeviceDto> {

        if(!deviceDto.barcode) {
            deviceDto.barcode = nanoid(10) + Number((now() / 1000).toFixed(0)).toString(16).substr(-4);
        }

        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)) {
            deviceDto.customer = authUser.customer;
        }else{
            if (deviceDto.customer) {
                deviceDto.customer = await this._customerService.findById(deviceDto.customer);
        
                if (!deviceDto.customer) {
                    throw new NotFoundException("Customer does not exist");
                }
            }
        }

        if (deviceDto.renter) {
            deviceDto.renter = await this._customerService.findById(deviceDto.renter);
    
            if (!deviceDto.renter) {
                throw new NotFoundException("Customer does not exist");
            }
        }

       
        if (deviceDto.assigned) {
            deviceDto.assigned = await this._userService.findById(deviceDto.assigned);
    
            if (!deviceDto.assigned) {
                throw new NotFoundException("User does not exist");
            }
        }

        const createdDevice = await this._deviceService.createDevice(deviceDto);
        return createdDevice.toDto();
    }

    @Get('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR, RoleType.TESTER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: DeviceDto, description: 'Requested device' })
    @ApiParam({ name: 'id', description: 'Device identifier', type: 'string' })
    async getDevice(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<DeviceDto> {
        const device = await this._deviceService.findById(id, authUser);

        if (!device) {
            throw new NotFoundException();
        }

        return device.toDto();
    }

    @Put('/checkout')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR )
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: DeviceDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async deviceCheckout(
        @Body() data: DeviceCheckInOutDto,
        @AuthUser() authUser: UserEntity): Promise<any> {
           
        const queryData = {...data};
        delete queryData.location;

        const device = await this._deviceService.findOne(queryData, authUser, true);
        
        if(!device){
            throw new BadRequestException("Device not found");
        }

        if(device.assigned && device.assigned.id != authUser.id){
            throw new BadRequestException("error.device.already_checked_out_by_other");
        }

        if(device.assigned && device.assigned.id === authUser.id){
            throw new BadRequestException("error.device.already_checked_out_by_you");
        }

        const updateDevice = new DeviceUpdateDto();
        updateDevice.assigned = authUser;
        updateDevice.location = data.location;

        const updatedDevice = await this._deviceService.updateDevice(device.id, updateDevice, authUser, true);        

        return updatedDevice.toDto();
    }

    @Put('/checkin')
    @Roles(RoleType.TESTER, RoleType.TESTER_MONITOR )
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: DeviceDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Job identifier', type: 'string' })
    async deviceCheckin(
        @Body() data: DeviceCheckInOutDto,
        @AuthUser() authUser: UserEntity): Promise<any> {
           
        const queryData = {...data};
        delete queryData.location;

        const device = await this._deviceService.findOne(queryData, authUser);
        
        if(!device){
            throw new BadRequestException("Device not found");
        }

        const updateDevice = new DeviceUpdateDto();
        updateDevice.assigned = null;
        updateDevice.location = data.location;

        const updatedDevice = await this._deviceService.updateDevice(device.id, updateDevice, authUser, true);        

        return updatedDevice.toDto();
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.TESTER_MONITOR, RoleType.TESTER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: DeviceDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Device identifier', type: 'string' })
    async updateDevice(
        @Param('id') id: string,
        @Body() deviceDto: DeviceUpdateDto,
        @AuthUser() authUser: UserEntity): Promise<DeviceDto> {
        if (authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)) {
            delete deviceDto.customer;
            delete deviceDto.renter;
        }else{
            if (deviceDto.customer) {
                deviceDto.customer = await this._customerService.findById(deviceDto.customer);
        
                if (!deviceDto.customer) {
                    throw new NotFoundException("Customer does not exist");
                }
            }

            if (deviceDto.renter) {
                deviceDto.renter = await this._customerService.findById(deviceDto.renter);
        
                if (!deviceDto.renter) {
                    throw new NotFoundException("Customer does not exist");
                }
            }
        }
       
        if (deviceDto.assigned) {
            deviceDto.assigned = await this._userService.findById(deviceDto.assigned);
    
            if (!deviceDto.assigned) {
                throw new NotFoundException("User does not exist");
            }
        }

        const updatedDevice = await this._deviceService.updateDevice(id, deviceDto, authUser);
        
        return updatedDevice.toDto();
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Device identifier', type: 'string' })
    async deleteDevice(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._deviceService.deleteDevice(id, authUser);
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
            const parsed = await this._deviceService.importer(file);
        }

        return true;
    }
}
