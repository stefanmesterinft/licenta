import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { AuditDto } from './dto/Audit.dto';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'audits' })
export class AuditEntity extends AbstractEntity<AuditDto> {
    @Column({ nullable: true })
    action: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    entityName: string;

    @Column({ nullable: true })
    entityId: string;

    @ManyToOne(() => UserEntity)
    @JoinTable()
    user: UserEntity;

    dtoClass = AuditDto;
}
