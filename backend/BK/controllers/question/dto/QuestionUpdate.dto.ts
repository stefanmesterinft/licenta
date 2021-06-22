'use strict';
import { IsString, IsOptional, IsEnum, IsArray, ArrayNotEmpty, ArrayUnique, ValidateIf } from 'class-validator';
import { AnswerType } from '../../../common/constants/answer-type';

export class QuestionUpdateDto {
    @IsString()
    question: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    parent?: any;

    @IsEnum(AnswerType)
    answerType: AnswerType;

    @ValidateIf((o) => [
        AnswerType.DROPDOWN,
        AnswerType.CHECKBOX,
        AnswerType.RADIO
    ].includes(o.answerType))
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    answers?: string[];

    @ValidateIf((o) => !!o.parent && o.parentAnswersRequired)
    @IsArray()
    @ArrayUnique()
    parentAnswersRequired?: string[];
}
