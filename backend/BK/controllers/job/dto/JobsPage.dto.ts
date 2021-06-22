import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { JobDto } from './Job.dto';

export class JobsPageDto {
    readonly data: JobDto[];
    readonly meta: PageMetaDto;

    constructor(data: JobDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
