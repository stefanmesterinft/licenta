import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, Max, Min, IsObject, IsString, IsOptional } from 'class-validator';

import { Order } from '../constants/order';

export class PageOptionsDto {
    @ApiPropertyOptional({
        enum: Order,
        default: Order.ASC,
    })
    @IsEnum(Order)
    readonly order?: Order = Order.ASC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly currentPage?: number = 1;

    @ApiPropertyOptional({
        minimum: 10,
        maximum: 999,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(10)
    @Max(999)
    readonly itemsPerPage?: number = 10;

    @ApiPropertyOptional({ default: null })
    @IsOptional()
    @IsString()
    readonly q?: string;

    @ApiPropertyOptional({ default: {} })
    @IsOptional()
    readonly filter?: any | any[] = {};

    @ApiPropertyOptional({ default: {} })
    @IsOptional()
    readonly sort?: any = {};

    get skip(): number {
        return (this.currentPage - 1) * this.itemsPerPage;
    }

    get take(): number {
        return this.itemsPerPage;
    }
}
