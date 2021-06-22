import { Column, Entity, Index, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CustomerDto } from './dto/Customer.dto';
import { UserEntity } from '../user/user.entity';
import { CustomerType } from '../../common/constants/customer-type';
import { CustomerSubtype } from '../../common/constants/customer-subtype';
import { Transform } from 'class-transformer';

@Entity({ name: 'customers' })
export class CustomerEntity extends AbstractEntity<CustomerDto> {
    @Column()
    name: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ nullable: false })
    @Index({ unique: true, where: "deleted_at is NULL" })
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address1: string;

    @Column({ nullable: true })
    address2: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    postalCode: string;

    @Column({ 
        type:"enum", 
        enum: CustomerType, 
        default: CustomerType.CLIENT
    })
    type: CustomerType = CustomerType.CLIENT;

    @Column({ 
        type:"enum", 
        enum: CustomerSubtype, 
        nullable: true,
        default: undefined
    })
    subtype: CustomerSubtype = undefined;

    @Column({nullable:true})
    suspendedAt?:Date;

    @OneToMany(() => UserEntity, user => user.customer)
    users: UserEntity[];

    dtoClass = CustomerDto;
}
