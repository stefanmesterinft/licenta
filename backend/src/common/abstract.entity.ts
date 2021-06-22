'use strict';

import {
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    DeleteDateColumn
} from 'typeorm';

import { UtilsService } from '../providers/utils.service';
import { AbstractDto } from './dto/Abstract.dto';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        type: 'timestamp without time zone',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp without time zone',
    })
    deletedAt: Date;

    @Exclude()
    abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

    toDto(options?: any): T {
        return UtilsService.toDto(this.dtoClass, this, options);
    }
}
