'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { ToInt } from '../../decorators/transforms.decorator';

export class AbstractSearchDto {
    @IsNotEmpty()
    q: string;
    @IsNotEmpty()
    currentPage: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @ToInt()
    itemsPerPage?: number = 10;

    get skip(): number {
        return (this.currentPage - 1) * this.itemsPerPage;
    }

    get take(): number {
        return this.itemsPerPage;
    }
}
