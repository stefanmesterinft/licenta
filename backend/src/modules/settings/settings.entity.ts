import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { SettingDto } from './dto/Setting.dto';


@Entity({ name: 'settings' })
export class SettingEntity extends AbstractEntity<SettingDto> {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    value: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type:"simple-array",
        nullable: true
    })
    options?: string[];


    dtoClass = SettingDto;
}
