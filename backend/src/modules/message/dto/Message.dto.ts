'use strict';

import { Transform } from 'class-transformer';
import { MessageType } from 'common/constants/message-type';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { MessageEntity } from '../message.entity';

export class MessageDto extends AbstractDto {
    @Transform((value:string) => value.toLowerCase())
    email: string;
    message: string;
    name?: string;
    phone?: string;
    location?: string;
    type: MessageType;

    constructor(message: MessageEntity) {
        super(message);
        this.email = message.email;
        this.message = message.message;
        this.name = message.name;
        this.phone = message.phone;
        this.location = message.location;
        this.type = message.type;
    }
}
