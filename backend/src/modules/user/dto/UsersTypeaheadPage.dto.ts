import { PageMetaDto } from '../../../common/dto/PageMeta.dto';

export class UsersTypeaheadPageDto {
    readonly data: {id: string, name: string}[];
    readonly meta: PageMetaDto;

    constructor(data: any[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
