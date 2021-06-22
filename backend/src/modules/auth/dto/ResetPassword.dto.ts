'use strict';

import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class ResetPasswordDto {
    @ValidateIf((o) => !o.token || o.email)
    @IsNotEmpty()
    @Transform((value:string) => value.toLowerCase())
    email: string;
    
    @IsNotEmpty()
    password: string;

    @ValidateIf((o) => !o.currentPassword || o.token)
    @IsNotEmpty()
    token: string;
   
    @ValidateIf((o) => !o.token || o.currentPassword)
    @IsNotEmpty()
    currentPassword: string;
}
