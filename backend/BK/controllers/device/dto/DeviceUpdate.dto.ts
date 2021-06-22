'use strict';
import { IsNotEmpty, IsString, IsArray, IsEnum, IsOptional, IsObject } from 'class-validator';
import { DeviceType } from 'common/constants/device-type';
import { Transform } from 'class-transformer';

export class DeviceUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    identifier?: string;
    
    @IsOptional()
    @IsString()
    barcode?: string;

    @IsOptional()
    assigned?: any;

    @IsOptional()
    customer?: any;

    @IsOptional()
    renter?: any;

    @IsEnum(DeviceType)
    @IsOptional()
    type?: DeviceType;

    @IsOptional()
    @IsObject()
    @Transform(coordinates => coordinates ? {
        type: 'Point', coordinates: coordinates.split(",")
    } : null)
    location?: any;
}
