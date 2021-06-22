'use strict';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsEmail, IsPhoneNumber, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { FileEntity } from '../../file/file.entity';
import { UserEntity } from '../../user/user.entity';

export class ProductCreateDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @Type(() => Number)
    price: number;

    @IsNotEmpty()
    @IsString()
    size: string;

    @IsNotEmpty()
    @Type(() => Number)
    stock: number;

    @IsOptional()
    @Type(() => Number)
    new_price?: number;

    @IsOptional()
    @IsString()
    sex?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    image?: any;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    material?: string;

    // @IsOptional()
    // @IsArray()
    // comments?: any[];

    // @IsOptional()
    // @IsArray()
    // rating?: any[];
    
    user?: UserEntity;
}
