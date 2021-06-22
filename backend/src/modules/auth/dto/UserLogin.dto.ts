'use strict';

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
    @IsString()
    @Transform((value:string) => value.toLowerCase())
    email: string;
    @IsNotEmpty()
    password: string;
}
