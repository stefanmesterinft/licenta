'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsPostalCode,
    IsString,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { ManyToOne } from 'typeorm';

import { RoleType } from '../../../common/constants/role-type';
import { IsDateInThePast, IsPassword } from '../../../decorators/validators.decorator';
import { Transform } from 'class-transformer';

export class UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @IsPassword()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    avatar?: string;

    @IsArray()
    @IsEnum([RoleType.USER, RoleType.ADMIN], {
        each: true,
    })
    @ApiPropertyOptional({
        isArray: true,
        enum: [RoleType.USER, RoleType.ADMIN],
        default: [RoleType.USER],
    })
    roles: RoleType[] = [RoleType.USER];

    // If simple user
    @ValidateIf((o) => o.roles.includes(RoleType.USER) || o.phone)
    @IsNotEmpty()
    @IsPhoneNumber('RO')
    phone: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()
    @IsString()
    middleName?: string;

    @IsDateString()
    @IsDateInThePast()
    @IsOptional()
    dateOfBirth?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()
    @IsString()
    socialSecurityNumber?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsNotEmpty()
    address1: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()
    @IsString()
    address2: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsNotEmpty()
    city: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsNotEmpty()
    state: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsNotEmpty()
    @IsString()
    sex: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()// TemporaryOptional: Until app gets fixed on app store: @IsNotEmpty()
    @IsString()
    race_ethnicity?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER) || o.postalCode)
    @IsNotEmpty()
    @IsPostalCode('RO')
    postalCode: string;
}
