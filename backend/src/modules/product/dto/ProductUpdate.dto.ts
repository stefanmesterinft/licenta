'use strict';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsEmail, IsPhoneNumber, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { FileEntity } from '../../file/file.entity';
import { UserEntity } from '../../user/user.entity';

export class ProductUpdateDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @Type(() => Number)
    price?: number;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @Type(() => Number)
    stock?: number;

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

    // @IsNotEmpty()
    // @IsOptional()
    // @IsArray()
    // comments?: any[];

    // @IsNotEmpty()
    // @IsOptional()
    // @IsArray()
    // rating?: any[];
    
    user?: UserEntity;
}
