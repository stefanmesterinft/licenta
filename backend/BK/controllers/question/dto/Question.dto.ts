'use strict';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { QuestionEntity } from '../question.entity';
import { isObject } from 'lodash';
import { AnswerType } from '../../../common/constants/answer-type';
import { isArray } from 'class-validator';

export class QuestionDto extends AbstractDto {
    question: string;
    description?: string;
    answerType: AnswerType;
    answers?: string[];
    children?: QuestionDto[];
    parent?: QuestionDto;
    parentAnswersRequired?: string[];
    parentId?: string;

    constructor(question: QuestionEntity) {
        super(question);
        this.question = question.question;
        this.description = question.description;
        this.answerType = question.answerType;
        this.answers = question.answers;
        this.parent = question.parent && isObject(question.parent) ? question.parent.toDto() : question.parent;
        this.children = question.children && isArray(question.children) ? question.children.toDtos() : question.children;
        this.parentAnswersRequired = question.parentAnswersRequired;
        if(this.parent && this.parent.id){
            this.parentId = this.parent.id;
        }
    }
}
