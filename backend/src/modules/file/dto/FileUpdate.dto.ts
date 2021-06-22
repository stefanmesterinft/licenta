
'use strict';
import { Transform } from 'class-transformer';
import {
    IsOptional,
    IsString,
    IsEnum,
    IsEmail,
    IsPhoneNumber,
} from 'class-validator';
import { UserEntity } from 'modules/user/user.entity';
import { ManyToOne } from 'typeorm';

export class FileUpdateDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    file: string;

}