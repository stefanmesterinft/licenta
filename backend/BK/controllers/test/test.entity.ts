import { Column, Entity, ManyToMany, JoinTable, ManyToOne, CreateDateColumn } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { TestDto } from './dto/Test.dto';
import { UserEntity } from '../user/user.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { JobEntity } from '../job/job.entity';
import { Transform } from 'class-transformer';
import { DeviceEntity } from '../device/device.entity';
import { SampleEntity } from '../sample/sample.entity';
import { ResultType } from '../../common/constants/result-type';
import { TestType } from '../../common/constants/test-type';

@Entity({ name: 'tests' })
export class TestEntity extends AbstractEntity<TestDto> {
    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => UserEntity)
    @JoinTable()
    patient: UserEntity;

    @ManyToOne(() => JobEntity)
    @JoinTable()
    job: JobEntity;

    @ManyToOne(() => CustomerEntity)
    @JoinTable()
    client: CustomerEntity;

    @ManyToMany(() => UserEntity, testers => testers.tests)
    @JoinTable()
    testers?: UserEntity[];

    @ManyToMany(() => DeviceEntity, devices => devices.tests)
    @JoinTable()
    devices?: DeviceEntity[];

    @ManyToOne(() => SampleEntity)
    @JoinTable()
    sample: SampleEntity;

    @ManyToOne(() => CustomerEntity)
    @JoinTable()
    customer?: CustomerEntity;

    @Column({ nullable: true })
    result: ResultType;

    @Column({ nullable: true, default: TestType.COVID19 })
    type: TestType;

    @Column({ nullable: true })
    reason: string;

    @Column({
        type: 'geography',
        nullable: true,
        spatialFeatureType: 'Point', 
        srid: 4326 
    })
    location: any;

    @Column({type: 'decimal', precision: 5, scale: 2, nullable: true  })
    temperature: number;

    @Column({
        nullable: true,
        type: 'timestamp without time zone',
    })
    timeInserted?: Date;

    @Column({
        nullable: true,
        type: 'timestamp without time zone',
    })
    timeResult?: Date;
    
    @Column({
        nullable: true,
        type: 'json',
        default: {},
    })
    details?: any;

    @Column({
        nullable: true,
        type: 'json',
        default: [],
    })
    questions?: any[];

    dtoClass = TestDto;
}
