import { Transform } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { PhoneVerificationDto } from './dto/PhoneVerification.dto';


@Entity({ name: 'phone_verification' })
export class PhoneVerification extends AbstractEntity<PhoneVerificationDto> {
    @Column({ nullable: true })
    @IsPhoneNumber('US')
    phone: string;

    @Column({ nullable: true })
    token: string;

    dtoClass = PhoneVerificationDto;
}
