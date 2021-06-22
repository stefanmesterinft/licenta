'use strict';

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
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
import { AuditsPageDto } from './dto/AuditPage.dto';
import { AuditsPageOptionsDto } from './dto/AuditPageOptions.dto';
import { AuditService } from './audit.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('audits')
@ApiTags('audits')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
    constructor(
        private _auditService: AuditService,
        ) {}

    @Get('')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get audits list',
        type: AuditsPageDto,
    })
    getAudits(
        @Query() pageOptionsDto: AuditsPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<AuditsPageDto> {
        return this._auditService.getAudits(pageOptionsDto, authUser);
    }

}
