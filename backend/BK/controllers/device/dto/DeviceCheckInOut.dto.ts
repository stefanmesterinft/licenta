'use strict';
import { IsNotEmpty, IsString, IsOptional, IsObject, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeviceCheckInOutDto {
    @IsNotEmpty()
    @IsString()
    @ValidateIf(o => (!o.id && !o.barcode) || o.identifier)
    identifier?: string;

    @IsNotEmpty()
    @IsString()
    @ValidateIf(o => (!o.id && !o.identifier) || o.barcode)
    barcode?: string;

    @IsNotEmpty()
    @IsString()
    @ValidateIf(o => (!o.barcode && !o.identifier) || o.id)
    id?: string;

    @IsOptional()
    @IsObject()
    @Transform(coordinates => coordinates ? {
        type: 'Point', coordinates: coordinates.split(",")
    } : null)
    location?: any;
}
