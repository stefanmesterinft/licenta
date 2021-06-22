import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { AuditDto } from './Audit.dto';

export class AuditsPageDto {
    readonly data: AuditDto[];
    readonly meta: PageMetaDto;

    constructor(data: AuditDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
