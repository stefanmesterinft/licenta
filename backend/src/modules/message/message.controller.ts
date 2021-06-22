'use strict';

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { RolesGuard } from 'guards/roles.guard';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { MessageDto } from './dto/Message.dto';
import { MessageCreateDto } from './dto/MessageCreate.dto';
import { MessagesPageDto } from './dto/MessagesPage.dto';
import { MessagesPageOptionsDto } from './dto/MessagesPageOptions.dto';
import { MessageService } from './message.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { MessageUpdateDto } from './dto/MessageUpdate.dto';
import { UserEntity } from 'modules/user/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { MessageType } from 'common/constants/message-type';

@Controller('messages')
@ApiTags('messages')
@ApiBearerAuth()
export class MessageController {
    constructor(private _messageService: MessageService) { }

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of messages',
        type: MessagesPageDto,
    })
    getMessages(
        @Query() pageOptionsDto: MessagesPageOptionsDto,
    ): Promise<MessagesPageDto> {
        return this._messageService.getMessages(pageOptionsDto);
    }


    @Post('')
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    @Recaptcha()
    @ApiOkResponse({
        type: Boolean,
        description: 'Successfully Created',
    })
    async createMessage(
        @Body() messageDto: MessageCreateDto
    ): Promise<boolean> {
        const message = await this._messageService.createMessage(
            messageDto,
        );

        if (!message) {
            throw new NotFoundException();
        }

        return this._messageService.sendMessage(message);
    }

    @Get('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: MessageDto, description: 'Requested message' })
    @ApiParam({ name: 'id', description: 'Message identifier', type: 'string' })
    async getMessage(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
    ): Promise<MessageDto> {
        const message = await this._messageService.findById(id, authUser);

        if (!message) {
            throw new NotFoundException();
        }

        return message.toDto();
    }

    @Put('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: MessageDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Message identifier', type: 'string' })
    async updateMessage(
        @Param('id') id: string,
        @Body() messageDto: MessageUpdateDto,
        @AuthUser() authUser: UserEntity): Promise<MessageDto> {

        const updatedMessage = await this._messageService.updateMessage(id, messageDto, authUser);
        return updatedMessage.toDto();
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Message identifier', type: 'string' })
    async deleteMessage(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._messageService.deleteMessage(id, authUser);
    }
}
