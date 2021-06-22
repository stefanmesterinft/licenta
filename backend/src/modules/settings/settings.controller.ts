'use strict';

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { SettingsPageDto } from './dto/SettingsPage.dto';
import { SettingsPageOptionsDto } from './dto/SettingsPageOptions.dto';

import { SettingsService } from './settings.service';
import { SettingCreateDto } from './dto/SettingCreate.dto';
import { SettingEntity } from './settings.entity';
import { SettingUpdateDto } from './dto/SettingUpdate.dto';

@Controller('settings')
@ApiTags('settings')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class SettingsController {
    constructor(
        private _settingService: SettingsService,
        ) {}

    @Get('')
    @Roles(RoleType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get settings list',
        type: SettingsPageDto,
    })
    getsettings(
        @Query() pageOptionsDto: SettingsPageOptionsDto,
    ): Promise<SettingsPageDto> {
        return this._settingService.getSettings(pageOptionsDto);
    }


    

    @Post('')
    @Roles(RoleType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create a new Setting',
        type: SettingsPageDto,
    })
    createSetting(
        @Body() newSetting:SettingCreateDto,
    ): Promise<SettingEntity> {
        return this._settingService.createSetting(newSetting);
    }
    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update a Setting',
        type: SettingsPageDto,
    })
    updateSetting(
        @Body() newSetting:SettingUpdateDto,
        @Param() params:any
    ): Promise<SettingEntity> {
        return this._settingService.updateSetting(params.id,newSetting);
    }

}
