import { Column, Entity, JoinTable, ManyToOne, ManyToMany, OneToMany, Index } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { SampleDto } from './dto/Sample.dto';
import { SampleType } from '../../common/constants/sample-type';
import { UserEntity } from '../user/user.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { TestEntity } from '../test/test.entity';

@Entity({ name: 'samples' })
export class SampleEntity extends AbstractEntity<SampleDto> {
    @Column({ nullable: true })
    @Index({ unique: true, where: "(identifier != '' and identifier IS NOT NULL and deleted_at is NULL)"  })
    identifier: string;

    @Column({ nullable: true })
    @Index({ unique: true, where: "(barcode != '' and barcode IS NOT NULL and deleted_at is NULL)" })
    barcode: string;

    @Column({ nullable: true })
    units: number;

    @ManyToOne(() => UserEntity)
    @JoinTable()
    assigned: UserEntity;

    @ManyToOne(() => CustomerEntity)
    @JoinTable()
    customer: CustomerEntity;

    @ManyToOne(() => CustomerEntity)
    @JoinTable()
    renter: CustomerEntity;

    @OneToMany(() => TestEntity, test => test.sample)
    tests: TestEntity[];

    @Column({ nullable: true })
    type: SampleType;

    @Column({
        type: 'geography',
        nullable: true,
        spatialFeatureType: 'Point', 
        srid: 4326 
    })
    location: any;

    dtoClass = SampleDto;
}
