'use strict';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class JobCreateDto {
    @IsNotEmpty()
    @IsNumber()
    estimatedTests: Number;

    @IsNotEmpty()
    @IsString()
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
