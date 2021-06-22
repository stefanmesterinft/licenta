import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { SampleDto } from './Sample.dto';

export class SamplesPageDto {
    readonly data: SampleDto[];
    readonly meta: PageMetaDto;

    constructor(data: SampleDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
