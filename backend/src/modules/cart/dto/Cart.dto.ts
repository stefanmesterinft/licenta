'use strict';

import { Transform } from 'class-transformer';
import { isObject } from 'lodash';
import { FileDto } from '../../file/dto/File.dto';
import { UserDto } from 'modules/user/dto/User.dto';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { CartEntity } from '../cart.entity';
import { ProductDto } from '../../product/dto/Product.dto';

export class CartDto extends AbstractDto {
    quantity: number;
    user: UserDto;
    productId:any;

    constructor(cart: CartEntity) {
        super(cart);
        this.quantity = cart.quantity;
        this.user =
            cart.user && isObject(cart.user)
                ? cart.user.toDto()
                : cart.user;
        this.productId =
            cart.productId && isObject(cart.productId)
                ? cart.productId.toDto()
                : cart.productId;
    }
}
