import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { QuestionDto } from './Question.dto';

export class QuestionsPageDto {
    readonly data: QuestionDto[];
    readonly meta: PageMetaDto;

    constructor(data: QuestionDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
