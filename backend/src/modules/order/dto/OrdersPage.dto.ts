import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { OrderDto } from './Order.dto';

export class OrdersPageDto {
    readonly data: OrderDto[];
    readonly meta: PageMetaDto;

    constructor(data: OrderDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
