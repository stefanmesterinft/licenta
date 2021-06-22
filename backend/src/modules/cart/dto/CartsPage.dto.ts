import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { CartDto } from './Cart.dto';

export class CartsPageDto {
    readonly data: CartDto[];
    readonly meta: PageMetaDto;

    constructor(data: CartDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
