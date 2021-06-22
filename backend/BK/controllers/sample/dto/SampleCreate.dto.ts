'use strict';
import { IsNotEmpty, IsString, IsArray, IsEnum, IsOptional, IsObject, IsNumber, Min } from 'class-validator';
import { SampleType } from 'common/constants/sample-type';
import { Transform } from 'class-transformer';

export class SampleCreateDto {
    @IsNotEmpty()
    @IsString()
    identifier: string;
    
    @IsOptional()
    @IsString()
    barcode?: string;

    @IsNumber()
    @Min(0)
    units: number;

    @IsOptional()
    assigned?: any;

    @IsOptional()
    customer?: any;

    @IsEnum(SampleType)
    @IsNotEmpty()
    type: SampleType;

    @IsOptional()
    @IsObject()
    @Transform(coordinates => coordinates ? {
        type: 'Point', coordinates: coordinates.split(",")
    } : null)
    location?: any;
}
