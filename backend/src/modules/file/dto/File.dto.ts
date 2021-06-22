'use strict';

import { Transform } from 'class-transformer';
import { UserDto } from 'modules/user/dto/User.dto';
import { UserEntity } from 'modules/user/user.entity';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { FileEntity } from '../file.entity';
import { isObject } from 'lodash';

export class FileDto extends AbstractDto {
    title?: string;
    file: any;

    constructor(file: FileEntity) {
        super(file);
        this.title = file.title;
        this.file = file.file;
    }
}