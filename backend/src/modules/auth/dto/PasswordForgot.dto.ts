'use strict';

import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { AbstractDto } from '../../../common/dto/Abstract.dto';

export class PasswordForgotDto extends AbstractDto {
    @IsNotEmpty()
    @Transform((value:string) => value.toLowerCase())
    email: string;
    
    @IsNotEmpty()
    token: string;
}
