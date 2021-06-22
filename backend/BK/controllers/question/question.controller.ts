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
import { QuestionsPageDto } from './dto/QuestionsPage.dto';
import { QuestionsPageOptionsDto } from './dto/QuestionsPageOptions.dto';
import { QuestionService } from './question.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { QuestionDto } from './dto/Question.dto';
import { QuestionCreateDto } from './dto/QuestionCreate.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QuestionUpdateDto } from './dto/QuestionUpdate.dto';
import { QuestionsTypeaheadPageDto } from './dto/QuestionsTypeaheadPage.dto';

@Controller('questions')
@ApiTags('questions')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class QuestionController {
    constructor(
        private _questionService: QuestionService,
    ) { }

    @Get('')
    @Roles(RoleType.ADMIN, RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get questions list',
        type: QuestionsPageDto,
    })
    getQuestions(
        @Query() pageOptionsDto: QuestionsPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<QuestionsPageDto> {
        return this._questionService.getQuestions(pageOptionsDto, authUser);
    }

    @Get('tree')
    @Roles(RoleType.ADMIN, RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get questions flat tree',
        type: QuestionsPageDto,
    })
    getQuestionsTree(
        @Query() pageOptionsDto: QuestionsPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<QuestionsPageDto> {
        return this._questionService.getQuestionsTree();
    }

    @Get('typeahead')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get typeahead list',
        type: QuestionsPageDto,
    })
    getQuestionsTypeahead(
        @Query()
        pageOptionsDto: QuestionsPageOptionsDto,
        @AuthUser() authUser: UserEntity
    ): Promise<QuestionsTypeaheadPageDto> {
        return this._questionService.getQuestionsTypeahead(pageOptionsDto);
    }

    

    @Post('')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: QuestionDto, description: 'Successfully Created' })
    async createQuestion(
        @Body() questionDto: QuestionCreateDto,
        @AuthUser() authUser: UserEntity): Promise<QuestionDto> {

        if (questionDto.parent) {
            questionDto.parent = await this._questionService.findById(questionDto.parent);

            if (!questionDto.parent) {
                throw new BadRequestException("Wrong parent information");
            }
        }
      
        const createdQuestion = await this._questionService.createQuestion(questionDto);
        return createdQuestion.toDto();
    }

    @Get('/:id')
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: QuestionDto, description: 'Requested question' })
    @ApiParam({ name: 'id', description: 'Question identifier', type: 'string' })
    async getQuestion(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
        ): Promise<QuestionDto> {
        const question = await this._questionService.findById(id, authUser);

        if (!question) {
            throw new NotFoundException();
        }

        return question.toDto();
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.TESTER_ADMIN, RoleType.CLIENT)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: QuestionDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Question identifier', type: 'string' })
    async updateQuestion(
        @Param('id') id: string,
        @Body() questionDto: QuestionUpdateDto,
        @AuthUser() authUser: UserEntity): Promise<QuestionDto> {

        if (questionDto.parent) {
            questionDto.parent = await this._questionService.findById(questionDto.parent);

            if (!questionDto.parent) {
                throw new BadRequestException("Wrong parent information");
            }
        }

        const updatedQuestion = await this._questionService.updateQuestion(id, questionDto, authUser);        
        return updatedQuestion.toDto();
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN, RoleType.CLIENT)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Question identifier', type: 'string' })
    async deleteQuestion(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._questionService.deleteQuestion(id, authUser);
    }
}
