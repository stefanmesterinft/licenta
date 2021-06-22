'use strict';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';
import { MessageType } from '../../../common/constants/message-type';

export class MessageCreateDto {
    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @IsString()
    message: string;

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
