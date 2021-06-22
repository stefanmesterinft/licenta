'use strict';
import { IsNotEmpty } from 'class-validator';

export class TokenPayloadDto {
    expiresIn: number;
    @IsNotEmpty()
    accessToken: string;

    constructor(data: { expiresIn: number; accessToken: string }) {
        this.expiresIn = data.expiresIn;
        this.accessToken = data.accessToken;
    }
}
