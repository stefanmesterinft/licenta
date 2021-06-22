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

export class CustomerCreateDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    ein: string;

    @ValidateIf((o) =>
        o.type === CustomerType.TESTER,
    )
    @IsNotEmpty()
    @IsString()
    clia?: string;

    @IsNotEmpty()
    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @IsPhoneNumber('US')
    phone?: string;

    @IsNotEmpty()
    address1: string;

    @IsNotEmpty()
    @IsOptional()
    address2?: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    state: string;

    @IsPostalCode('US')
    postalCode: string;

    @IsOptional()
    @IsString()
    test_introduction?: string;

    @IsEnum(CustomerType)
    @ApiPropertyOptional({
        enum: CustomerType
    })
    type: CustomerType;

    @IsOptional()
    @IsEnum(CustomerSubtype)
    @ApiPropertyOptional({
        enum: CustomerSubtype
    })
    subtype?: CustomerSubtype;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    avatar?: string;
}
