'use strict';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsEmail, IsPhoneNumber, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ProductEntity } from '../../product/product.entity';
import { UserEntity } from '../../user/user.entity';

export class CartUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productId?:ProductEntity;

    user?: UserEntity;
}
