'use strict';

import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
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
import { I18nService } from 'nestjs-i18n';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/Customer.dto';
import { CustomerCreateDto } from './dto/CustomerCreate.dto';
import { CustomersPageDto } from './dto/CustomersPage.dto';
import { CustomersPageOptionsDto } from './dto/CustomersPageOptions.dto';
import { NotFoundException } from '@nestjs/common';
import { CustomerUpdateDto } from './dto/CustomerUpdate.dto';
import { CustomersTypeaheadPageDto } from './dto/CustomersTypeaheadPage.dto';
import { AuthUser } from 'decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { CustomersMembersPageDto } from './dto/CustomersMembersPage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadStorageFilter } from 'filters/upload-storage.filter';
import { UploadImageFilter } from '../../filters/upload-image.filter';

@Controller('customers')
@ApiTags('customers')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class CustomerController {
    constructor(
        private _customerService: CustomerService,
        private readonly _i18n: I18nService,
    ) {}

    @Get('')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get customers list',
        type: CustomersPageDto,
    })
    getCustomers(
        @Query() pageOptionsDto: CustomersPageOptionsDto,
    ): Promise<CustomersPageDto> {
        return this._customerService.getCustomers(pageOptionsDto);
    }

    @Get('typeahead')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get customers typeahead list',
        type: CustomersPageDto,
    })
    getCustomersTypeahead(
        @Query() pageOptionsDto: CustomersPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<CustomersTypeaheadPageDto> {
        if(!authUser.hasRole(RoleType.ADMIN)){
            return this._customerService.getCustomersByJobsTypeahead(pageOptionsDto, authUser);
        }

        return this._customerService.getCustomersTypeahead(pageOptionsDto);
    }

    @Post('')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: CustomerDto, description: 'Successfully Created' })
    async createCustomer(
        @Body() customerDto: CustomerCreateDto,
    ): Promise<CustomerDto> {
        const createdCustomer = await this._customerService.createCustomer(
            customerDto,
        );

        return createdCustomer.toDto();
    }
    @Get('suspend/:id')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully suspended' })
    @ApiParam({ name: 'id', description: 'Customer identifier', type: 'string' })
    async suspendCustomer(
        @Param('id') id: string,
        ): Promise<any> {
        let result = await this._customerService.suspendCustomer(id);
        return {'success':result};
    }
    @Get('unsuspend/:id')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully unsuspended' })
    @ApiParam({ name: 'id', description: 'Customer identifier', type: 'string' })
    async unsuspendCustomer(
        @Param('id') id: string,
        ): Promise<any> {
        let result = await this._customerService.unsuspendCustomer(id);
        return {'success':result};
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: CustomerDto, description: 'Requested customer' })
    @ApiParam({
        name: 'id',
        description: 'Customer identifier',
        type: 'string',
    })
    async getCustomer(@Param('id') id: string): Promise<CustomerDto> {
        const customer = await this._customerService.findById(id);

        if (!customer) {
            throw new NotFoundException();
        }

        return customer.toDto();
    }

    @Get('/:id/members')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: CustomerDto, description: 'Requested customer members' })
    @ApiParam({
        name: 'id',
        description: 'Customer identifier',
        type: 'string',
    })
    async getMembers(
        @Param('id') id: string,
        @Query() pageOptionsDto: CustomersPageOptionsDto,
        ): Promise<CustomersMembersPageDto> {
        const customer = await this._customerService.findById(id);

        if (!customer) {
            throw new NotFoundException();
        }

        const members = await this._customerService.getMembers(id, pageOptionsDto);

        return members;
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.CLIENT)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: CustomerDto, description: 'Successfully Updated' })
    @ApiParam({
        name: 'id',
        description: 'Customer identifier',
        type: 'string',
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: UploadStorageFilter(),
            fileFilter: UploadImageFilter
        })
    )
    async updateCustomer(
        @Param('id') id: string,
        @Body() customerDto: CustomerUpdateDto,
        @AuthUser() authUser: UserEntity,
        @UploadedFile() avatar,
    ): Promise<CustomerDto> {
        if(authUser.hasRole(RoleType.TESTER_ADMIN, RoleType.CLIENT)){
            if(authUser.customer?.id != id){
                throw new ForbiddenException();
            }
        }

        if(avatar && avatar.filename) {
            customerDto.avatar = `avatar/${avatar.filename}`;
        }
        
        const updatedCustomer = await this._customerService.updateCustomer(
            id,
            customerDto,
        );

        return updatedCustomer.toDto();
    }
}
