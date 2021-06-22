'use strict';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, IsDateString } from 'class-validator';

export class JobUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    estimatedTests: Number;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    title: string;

    @IsOptional()
    testers: any[];

    @IsOptional()
    customer: any;

    @IsOptional()
    createdBy: any;

    @IsOptional()
    client: any;

    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @IsOptional()
    @IsDateString()
    endDate?: Date;
}
