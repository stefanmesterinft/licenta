'use strict';

import {
    BadRequestException,
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
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
    ApiConsumes,
} from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';


import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Roles, RolesAllExcept } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { UserDto } from './dto/User.dto';
import { UserCreateDto } from './dto/UserCreate.dto';
import { UsersPageDto } from './dto/UsersPage.dto';
import { UsersPageOptionsDto } from './dto/UsersPageOptions.dto';
import { UserUpdateDto } from './dto/UserUpdate.dto';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadImageFilter } from '../../filters/upload-image.filter';
import { UploadStorageFilter } from '../../filters/upload-storage.filter';
import { UsersTypeaheadPageDto } from './dto/UsersTypeaheadPage.dto';
import { AuthService } from '../auth/auth.service';
import { UploadStorageFilter2 } from 'filters/upload-profile.filter';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
    constructor(
        private _userService: UserService,
        private _authService: AuthService,
        private readonly _i18n: I18nService,
    ) {}

    @Get('')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get users list',
        type: UsersPageDto,
    })
    getUsers(
        @Query()
        pageOptionsDto: UsersPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<UsersPageDto> {
        return this._userService.getUsers(pageOptionsDto, authUser);
    }

    @Get('admin')
    @Roles(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    async admin(@AuthUser() authUser: UserEntity): Promise<string> {
        const translation = await this._i18n.translate(
            'translations.keywords.admin',
            {
                lang: 'en',
            },
        );
        return `${translation} ${authUser.firstName} ${authUser.lastName}`;
    }

    
    @Get('/typeahead')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get users typeahead list',
        type: UsersPageDto,
    })
    getUsersTypeahead(
        @Query()
        pageOptionsDto: UsersPageOptionsDto,
        @AuthUser() authUser: UserEntity,
    ): Promise<UsersTypeaheadPageDto> {        
        return this._userService.getUsersTypeahead(pageOptionsDto, authUser);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get user',
        type: UsersPageDto,
    })
    async getUser(
        @Param('id') id: string,
        @AuthUser() _authUser: UserEntity
    ): Promise<UserDto> {
        const user = await this._userService.findById(id);
        if (!user) {
            throw new NotFoundException();
        }
        
        const userDto = user.toDto();

        return userDto;
    }


    @Put('/profile')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Updated' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'avatar' },
            { name: 'cover' }
        ], {
            storage: UploadStorageFilter2(),
            fileFilter: UploadImageFilter
        })
    )
    async updateProfile(
        @Body() userDto: UserUpdateDto,
        @UploadedFiles() files,
        @AuthUser() authUser: UserEntity
    ): Promise<UserDto> {
        if(userDto.roles){
            delete userDto.roles;
        }

        if(files && files.avatar && files.avatar[0].filename) {
            userDto.avatar = `avatar/${files.avatar[0].filename}`;
        }

        if(files && files.cover && files.cover[0].filename){
            userDto.cover = `cover/${files.cover[0].filename}`;
        }

        const updatedUser = await this._userService.updateProfile(userDto, authUser);
        const updatedUserDto = updatedUser.toDto();

        return updatedUserDto;
    }

    @Post('')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Created' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'avatar' },
            { name: 'cover' }
        ], {
            storage: UploadStorageFilter(),
            fileFilter: UploadImageFilter
        })
    )
    async createUser(
        @Body() userDto: UserCreateDto,
        @UploadedFiles() files,
        @AuthUser() authUser: UserEntity,
    ): Promise<UserDto> {
        // if (authUser.hasRole(RoleType.ADMIN)) {
        //     if(userDto.roles.length != 1 || !userDto.hasRole(RoleType.USER)){
        //         throw new BadRequestException("You can only add users with role USER.");
        //     }


        //     const user = await this._userService.findByEmailOrSSN(userDto.email, userDto.socialSecurityNumber);
        //     if(user){
        //         const existUserDto = user.toDto();
        //         if (userDto.forceUpdate !== 'true') {
        //             existUserDto.existed = true;
        //             return existUserDto;
        //         }else{
        //             delete userDto.email;
        //             delete userDto.socialSecurityNumber;
        //             delete userDto.password;
        //             delete userDto.forceUpdate;
        //             return this.updateUser(user.id, userDto, files, authUser);
        //         }
        //     }
        // }

    
        if(files && files.avatar && files.avatar[0].filename) {
            userDto.avatar = `avatar/${files.avatar[0].filename}`;
        }

        if(files && files.cover && files.cover[0].filename){
            userDto.cover = `cover/${files.cover[0].filename}`;
        }
        
        const createdUser = await this._userService.createUser(userDto);

        if(!createdUser.password){
            await this._authService.sendEmailSetPassword(createdUser.email);
        }

        return createdUser.toDto();
    }

    @Get('suspend/:id')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully suspended' })
    @ApiParam({ name: 'id', description: 'User identifier', type: 'string' })
    async suspendUser(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<any> {
        let result = await this._userService.suspendUser(id, authUser);
        return {'success':result};
    }
    @Get('unsuspend/:id')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully unsuspended' })
    @ApiParam({ name: 'id', description: 'User identifier', type: 'string' })
    async unsuspendUser(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<any> {
        let result = await this._userService.unsuspendUser(id, authUser);
        return {'success':result};
    }

    @Put('/:id')
    @Roles( RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'User identifier', type: 'string' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'avatar' },
            { name: 'cover' }
        ], {
            storage: UploadStorageFilter2(),
            fileFilter: UploadImageFilter
        })
    )
    async updateUser(
        @Param('id') id: string,
        @Body() userDto: UserUpdateDto,
        @UploadedFiles() files,
        @AuthUser() authUser: UserEntity
    ): Promise<UserDto> {
        console.log(userDto,userDto.hasRole(RoleType.USER),authUser.hasRole(RoleType.ADMIN));
        
        // if (!authUser.hasRole(RoleType.ADMIN)) {
        //     if(userDto.roles.length != 1 || !userDto.hasRole(RoleType.USER)){
        //         throw new BadRequestException("You can only use user role USER");
        //     }
        // }

        if(userDto.roles && userDto.roles.length === 0){
            delete userDto.roles;
        }

        if(files && files.avatar && files.avatar[0].filename) {
            userDto.avatar = `avatar/${files.avatar[0].filename}`;
        }

        if(files && files.cover && files.cover[0].filename){
            userDto.cover = `cover/${files.cover[0].filename}`;
        }
        console.log(userDto);
        
        const updatedUser = await this._userService.updateUser(id, userDto, authUser);
        const updatedUserDto = updatedUser.toDto();

        return updatedUserDto;
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'User identifier', type: 'string' })
    async deleteUser(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<boolean> {
        return this._userService.deleteUser(id, authUser);
    }
}
