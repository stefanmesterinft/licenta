import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { MessageDto } from './Message.dto';

export class MessagesPageDto {
    readonly data: MessageDto[];
    readonly meta: PageMetaDto;

    constructor(data: MessageDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
