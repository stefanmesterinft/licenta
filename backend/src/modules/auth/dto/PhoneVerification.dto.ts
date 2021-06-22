'use strict';

import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { AbstractDto } from '../../../common/dto/Abstract.dto';

export class PhoneVerificationDto extends AbstractDto {
    @IsNotEmpty()
    @IsPhoneNumber('US')
    phoneNumber: string;
    
    @IsNotEmpty()
    token: string;
}
