import { Column, Entity, JoinTable, ManyToOne, Tree, TreeChildren, TreeParent } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { QuestionDto } from './dto/Question.dto';
import { AnswerType } from '../../common/constants/answer-type';
import { ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

@Entity({ name: 'questions' })
@Tree("nested-set")
export class QuestionEntity extends AbstractEntity<QuestionDto> {
    @Column()
    question: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: "enum",
        enum: AnswerType,
        default: AnswerType.TEXT
    })
    answerType: AnswerType;

    @Column({ type: "simple-array", nullable: true })
    answers: string[];

    @TreeChildren()
    children: QuestionEntity[];

    @TreeParent()
    parent: QuestionEntity;

    @Column({ type: "simple-array", nullable: true})
    parentAnswersRequired?: string[];

    dtoClass = QuestionDto;
}
