import { Transform } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { EmailVerificationDto } from './dto/EmailVerification.dto';

@Entity({ name: 'email_verification' })
export class EmailVerification extends AbstractEntity<EmailVerificationDto> {
    @Column({ nullable: true })
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @Column({ nullable: true })
    token: string;

    dtoClass = EmailVerificationDto;
}
