import { Column, Entity, JoinTable, ManyToOne, ManyToMany, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { JobDto } from './dto/Job.dto';
import { UserEntity } from '../user/user.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { TestEntity } from '../test/test.entity';

@Entity({ name: 'jobs' })
export class JobEntity extends AbstractEntity<JobDto> {
    @Column({ nullable: true })
    estimatedTests: Number;

    @Column({ nullable: true })
    title: string;

    @ManyToMany(() => UserEntity, assigned => assigned.jobs)
    @JoinTable()
    testers: UserEntity[];

    @ManyToOne(() => CustomerEntity)
    @JoinTable()
    customer: CustomerEntity;

    @ManyToOne(() => UserEntity)
    @JoinTable()
    createdBy: UserEntity;

    @ManyToOne(() => CustomerEntity)
    @JoinTable()
    client: CustomerEntity;

    @OneToMany(() => TestEntity, test => test.job)
    tests: TestEntity[];

    @Column({
        type: 'timestamp without time zone',
        nullable: true
    }) 
    startDate?: Date;

    @Column({
        type: 'timestamp without time zone',
        nullable: true
    })
    endDate?: Date;

    totalTests?: number = 0;
 
    dtoClass = JobDto;
}
