import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { TestDto } from './Test.dto';

export class TestsPageDto {
    readonly data: TestDto[];
    readonly meta: PageMetaDto;

    constructor(data: TestDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
