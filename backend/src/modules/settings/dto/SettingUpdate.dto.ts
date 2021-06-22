'use strict';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class SettingUpdateDto {

    @IsString()
    name: string;

    @IsString()
    value: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    options?:string[];
}
