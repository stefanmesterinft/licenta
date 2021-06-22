import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OrderDto } from './dto/Order.dto';
import { Transform } from 'class-transformer';
import { UserEntity } from '../user/user.entity';
import { StatusType } from '../../common/constants/status-type';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends AbstractEntity<OrderDto> {
    @ManyToMany(() => ProductEntity)
    @JoinTable()
    products:ProductEntity[];

    @Column("int", { array: true })
    quantity: number[];

    @Column({
        type: "enum",
        enum: StatusType,
        default: StatusType.PLACED
    })
    orderStatus: StatusType;

    @Column({ nullable: false })
    address:string;

    @Column({ nullable: false })
    shipping:string;

    
    @Column({ nullable: false })
    price:number;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    dtoClass = OrderDto;
}
