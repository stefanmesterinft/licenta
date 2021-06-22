import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { CustomerDto } from './Customer.dto';

export class CustomersPageDto {
    readonly data: CustomerDto[];
    readonly meta: PageMetaDto;

    constructor(data: CustomerDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
