'use strict';
import { UserDto } from '../../user/dto/User.dto';
import { TokenPayloadDto } from './TokenPayload.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPayloadDto {
    @ApiProperty({ type: UserDto })
    user: UserDto;
    @ApiProperty({ type: TokenPayloadDto })
    token: TokenPayloadDto;

    constructor(user: UserDto, token: TokenPayloadDto) {
        this.user = user;
        this.token = token;
    }
}
