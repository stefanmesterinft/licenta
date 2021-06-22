'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
    IsBooleanString
} from 'class-validator';

import { RoleType } from '../../../common/constants/role-type';
import { IsPassword, IsDateInThePast } from '../../../decorators/validators.decorator';

export class UserCreateDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @IsOptional()
    @IsPassword()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsPhoneNumber('RO')
    phone: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    avatar?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    cover?: string;

    @IsOptional()
    @IsString()
    about?: string;

    @IsArray()
    @IsEnum(RoleType, { each: true })
    @ApiPropertyOptional({
        isArray: true,
        enum: RoleType,
        default: [RoleType.USER],
    })
    roles: RoleType[] = [RoleType.USER];
    

    // If simple user
    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()
    @IsString()
    middleName?: string;


    @IsOptional()
    @IsDateString()
    @IsDateInThePast()
    dateOfBirth?: Date;

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

    @ValidateIf((o) => o.roles.includes(RoleType.USER) || o.postalCode)
    @IsNotEmpty()
    @IsPostalCode('RO')
    postalCode: string;

    @IsString()
    @IsOptional() // TemporaryOptional: Until app gets fixed on app store: @IsNotEmpty()
    sex: string;

    @IsString()
    @IsOptional() // TemporaryOptional: Until app gets fixed on app store: @IsNotEmpty()
    race_ethnicity?: string;

    @IsOptional()
    @IsBooleanString()
    forceUpdate?: string;

    /** @this UserDto */
    hasRole(...roles: RoleType[]) {
        return this.roles.some((r) => roles.includes(r));
    }

    @IsOptional()
    @Transform((value) =>
        value != undefined && value != 0 && value != 'null' && value != '0' && value != 'false' && value != false ? true : false,
    )
    emailConfirmed?:boolean;
}
