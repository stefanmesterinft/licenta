'use strict';

import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AbstractDto } from '../../../common/dto/Abstract.dto';

export class EmailVerificationDto extends AbstractDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform((value:string) => value.toLowerCase())
    email: string;
    
    @IsNotEmpty()
    token: string;
}
