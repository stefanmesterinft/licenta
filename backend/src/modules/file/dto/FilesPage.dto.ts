import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { FileDto } from './File.dto';

export class FilePageDto {
    readonly data: FileDto[];
    readonly meta: PageMetaDto;

    constructor(data: FileDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}