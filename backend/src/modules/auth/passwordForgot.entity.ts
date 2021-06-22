import { Column, Entity } from 'typeorm';

import { PasswordForgotDto } from './dto/PasswordForgot.dto';
import { AbstractEntity } from '../../common/abstract.entity';
import { Transform } from 'class-transformer';

@Entity({ name: 'password_forgot' })
export class PasswordForgot extends AbstractEntity<PasswordForgotDto> {
    @Column({ nullable: true })
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @Column({ nullable: true })
    token: string;

    dtoClass = PasswordForgotDto;
}
