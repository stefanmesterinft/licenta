'use strict';

import { Transform } from 'class-transformer';
import { StatusType } from 'common/constants/status-type';
import { isArray, isObject } from 'lodash';
import { ProductDto } from 'modules/product/dto/Product.dto';
import { ProductEntity } from 'modules/product/product.entity';
import { UserDto } from 'modules/user/dto/User.dto';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { OrderEntity } from '../order.entity';

export class OrderDto extends AbstractDto {
    products:any[];
    quantity: number[];
    price: number;
    shipping: string;
    orderStatus: StatusType;
    address:string;
    user: UserDto;

    constructor(order: OrderEntity) {
        super(order);
        this.price = order.price;
        this.shipping = order.shipping;
        this.orderStatus = order.orderStatus;
        this.address = order.address;
        this.quantity = [...order.quantity];
        this.products =
        order.products && isArray(order.products)
            ? order.products.toDtos()
            : order.products;
        this.user =
        order.user && isObject(order.user)
            ? order.user.toDto()
            : order.user;
    }
}
