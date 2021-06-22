'use strict';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsEmail, IsPhoneNumber } from 'class-validator';
import { MessageType } from '../../../common/constants/message-type';

export class MessageUpdateDto {
    @IsOptional()
    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsPhoneNumber('US')
    phone?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsEnum(MessageType)
    type?: MessageType;
}
