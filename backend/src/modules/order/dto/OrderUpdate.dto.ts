'use strict';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsEmail, IsPhoneNumber, IsNotEmpty, IsInt, IsArray } from 'class-validator';
import { StatusType } from 'common/constants/status-type';
import { ProductEntity } from 'modules/product/product.entity';
import { JoinTable, ManyToMany } from 'typeorm';
import { UserEntity } from '../../user/user.entity';

export class OrderUpdateDto {
    @ManyToMany(() => ProductEntity)
    @JoinTable()
    products: any[];

    @IsArray()
    quantity:number[];

    @IsInt()
    @IsNotEmpty()
    price:number;

    @IsString()
    @IsNotEmpty()
    shipping:string;

    @IsNotEmpty()
    @IsEnum(StatusType)
    orderStatus: StatusType;

    @IsString()
    @IsNotEmpty()
    address:string;

    user?: UserEntity;

}
