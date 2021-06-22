'use strict';
import { IsString, IsOptional } from 'class-validator';

export class AuditCreateDto {
    @IsString()
    action: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    entityName: string;

    @IsOptional()
    @IsString()
    entityId: string;

    @IsOptional()
    user: any;
}
