'use strict';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEnum,
    IsOptional,
    IsString,
    IsEmail,
    IsPhoneNumber,
} from 'class-validator';
import { UserEntity } from 'modules/user/user.entity';
import { ManyToOne } from 'typeorm';

export class FileCreateDto {
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    file: string;


}