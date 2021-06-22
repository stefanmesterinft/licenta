'use strict';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsEmail, IsPhoneNumber, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ProductEntity } from '../../product/product.entity';
import { UserEntity } from '../../user/user.entity';

export class CartCreateDto {
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    productId?:ProductEntity;
    
    user?: UserEntity;
}
