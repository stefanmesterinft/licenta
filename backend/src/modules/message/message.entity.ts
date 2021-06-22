import { MessageType } from '../../common/constants/message-type';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { MessageDto } from './dto/Message.dto';
import { Transform } from 'class-transformer';

@Entity({ name: 'messages' })
export class MessageEntity extends AbstractEntity<MessageDto> {
    @Column({ nullable: false })
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @Column({ nullable: false })
    message: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    location?: string;

    @Column({
        type: "enum",
        enum: MessageType,
        default: MessageType.CONTACT
    })
    type: MessageType;

    dtoClass = MessageDto;
}
