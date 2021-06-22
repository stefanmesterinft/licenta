import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { FileDto } from './dto/File.dto';
import { Transform } from 'class-transformer';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'files' })
export class FileEntity extends AbstractEntity<FileDto> {
    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    file: string;

    dtoClass = FileDto;
}