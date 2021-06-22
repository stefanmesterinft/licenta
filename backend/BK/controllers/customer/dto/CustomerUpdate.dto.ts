import { IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { CustomerType } from '../../../common/constants/customer-type';
'use strict';

import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsPostalCode,
    IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerSubtype } from '../../../common/constants/customer-subtype';
import { Transform } from 'class-transformer';

export class CustomerUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    ein?: string;

    @ValidateIf((o) =>
        o.type === CustomerType.TESTER,
    )
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    clia?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email?: string;

    @IsOptional()
    @IsPhoneNumber('US')
    phone?: string;

    @IsOptional()
    @IsNotEmpty()
    address1?: string;

    @IsOptional()
    @IsNotEmpty()
    address2?: string;

    @IsOptional()
    @IsNotEmpty()
    city?: string;

    @IsOptional()
    @IsNotEmpty()
    state?: string;

    @IsOptional()
    @IsPostalCode('US')
    postalCode?: string;

    @IsOptional()
    @IsString()
    test_introduction?: string;

    @IsOptional()
    @IsEnum(CustomerType)
    @ApiPropertyOptional({
        enum: CustomerType
    })
    type?: CustomerType;

    @IsOptional()
    @IsEnum(CustomerSubtype)
    @ApiPropertyOptional({
        enum: CustomerSubtype
    })
    subtype?: CustomerSubtype;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    avatar?: string;
}
