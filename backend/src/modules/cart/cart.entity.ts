import { UserEntity } from '../user/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CartDto } from './dto/Cart.dto';
import { FileEntity } from '../file/file.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'carts' })
export class CartEntity extends AbstractEntity<CartDto> {

    @ManyToOne(() => ProductEntity)
    @JoinColumn()
    productId: ProductEntity;

    @Column({ nullable: false })
    quantity: number;

    //@ManyToMany(() => CommentEntity)
    // @Column({ nullable: true })
    // comments?: any[];

    //@ManyToMany(() => RatingEntity)
    // @Column({ nullable: true })
    // rating?: any[];
    
    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    dtoClass = CartDto;
}
