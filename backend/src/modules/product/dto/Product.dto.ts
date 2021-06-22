'use strict';

import { Transform } from 'class-transformer';
import { isObject } from 'lodash';
import { FileDto } from '../../file/dto/File.dto';
import { UserDto } from 'modules/user/dto/User.dto';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { ProductEntity } from '../product.entity';

export class ProductDto extends AbstractDto {
    name: string;
    brand: string;
    price: number;
    size: string;
    stock: number;
    new_price: number;
    sex?: string;
    color?: string;
    image?: any;
    description?: string;
    material?: string;
    // comments?: any[];
    // rating?: any[];
    user: UserDto;
    code:string
    quantity?:number


    constructor(product: ProductEntity) {
        super(product);
        this.name = product.name;
        this.code = product.code;
        this.brand = product.brand;
        this.price = product.price;
        this.size = product.size;
        this.stock = product.stock;
        this.new_price = product.new_price;
        this.sex = product.sex;
        this.color = product.color;
        this.image = product.image;
        this.material = product.material;
        this.quantity = product.quantity;

        // this.comments = product.comments;
        // this.rating = product.rating;
        this.user =
            product.user && isObject(product.user)
                ? product.user.toDto()
                : product.user;
    }
}
