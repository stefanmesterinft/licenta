import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { ProductDto } from './Product.dto';

export class ProductsPageDto {
    readonly data: ProductDto[];
    readonly meta: PageMetaDto;

    constructor(data: ProductDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
