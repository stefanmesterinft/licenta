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
} from 'class-validator';

import { RoleType } from '../../../common/constants/role-type';
import { IsPassword, IsDateInThePast } from '../../../decorators/validators.decorator';

export class UserUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email?: string;

    @IsOptional()
    @IsPassword()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsPhoneNumber('RO')
    phone: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    avatar?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    cover?: string;

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(RoleType, { each: true })
    @ApiPropertyOptional({
        isArray: true,
        enum: RoleType
    })
    roles?: RoleType[] = [];

    // If simple user
    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()
    @IsString()
    middleName?: string;

    @IsDateString()
    @IsOptional()
    @IsDateInThePast()
    dateOfBirth?: Date;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()
    @IsString()
    socialSecurityNumber?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsNotEmpty()
    @IsOptional()
    address1?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsOptional()
    @IsString()
    address2?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsNotEmpty()
    @IsOptional()
    city?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER))
    @IsNotEmpty()
    @IsOptional()
    state?: string;

    @ValidateIf((o) => o.roles.includes(RoleType.USER) || o.postalCode)
    @IsNotEmpty()
    @IsPostalCode('RO')
    @IsOptional()
    postalCode?: string;

    @IsOptional()
    @IsString()
    sex?: string;

    @IsOptional()
    @IsString()
    race_ethnicity?: string;

    @ValidateIf((o) =>
        o.roles.some((r) =>
            [
                RoleType.ADMIN,
            ].includes(r),
        ),
    )

    /** @this UserDto */
    hasRole(...roles: RoleType[]) {
        return this.roles.some((r) => roles.includes(r));
    }
    
    @IsOptional()
    @Transform((value) =>
        value != undefined && value.toLowerCase() === 'true' ? true : false,
    )
    @ApiPropertyOptional({
        default:false
    })
   
    emailConfirmed?:boolean;
}
