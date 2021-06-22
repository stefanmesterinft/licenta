'use strict';
import { IsOptional, IsNotEmpty, IsString, Min, IsNumber, Max, ValidateIf, IsLatLong, IsObject, IsDateString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { TestType } from 'common/constants/test-type';
import { ResultType } from 'common/constants/result-type';

export class TestCreateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    code: string;
    
    @IsNotEmpty()
    patient: any;

    @IsOptional()
    @IsNotEmpty()
    job: any;

    @IsOptional()
    @IsNotEmpty()
    tester?: any;

    @IsOptional()
    @IsNotEmpty()
    devices?: any | any[];

    @IsOptional()
    @IsString()
    customer?: any;

    @IsOptional()
    @IsNotEmpty()
    @Transform(value => value ? value.toUpperCase() : null)
    @IsEnum(ResultType)
    result?: ResultType;

    @IsOptional()
    @IsEnum(TestType)
    @IsNotEmpty()
    type?: TestType;

    @IsOptional()
    @IsNotEmpty()
    @ValidateIf(o => o.temperature != 0)
    @IsNumber()
    @Min(90)
    @Max(105)
    temperature?: number;

    @IsOptional()
    @IsObject()
    @Transform(coordinates => coordinates ? {
        type: 'Point', coordinates: coordinates.split(",")
    } : null)
    location?: any;

    @IsOptional()
    @IsNotEmpty()
    sample?: any;

    @IsOptional()
    @IsObject()
    details?: any;

    @IsOptional()
    @IsDateString()
    time?: Date;

    @IsOptional()
    @IsDateString()
    timeInserted?: Date;

    timeResult?: Date;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    questions?: any[];
}
