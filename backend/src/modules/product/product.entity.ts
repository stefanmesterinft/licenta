import { UserEntity } from '../user/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ProductDto } from './dto/Product.dto';
import { FileEntity } from '../file/file.entity';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity<ProductDto> {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    code: string;

    @Column({ nullable: false })
    brand: string;

    @Column({ nullable: false })
    price: number;

    @Column({ nullable: false })
    size: string;

    @Column({ nullable: false })
    stock: number;

    @Column({ nullable: true })
    new_price?: number;

    @Column({ nullable: true })
    sex?: string;

    @Column({ nullable: true })
    color?: string;

    @ManyToOne(() => FileEntity)
    @JoinTable()
    image: FileEntity;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    material?: string;

    //@ManyToMany(() => CommentEntity)
    // @Column({ nullable: true })
    // comments?: any[];

    //@ManyToMany(() => RatingEntity)
    // @Column({ nullable: true })
    // rating?: any[];
    
    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column({
        type: 'int',
        select: false,
        insert: false,
        readonly: true,
        nullable: true,
    })
    quantity?: number;

    dtoClass = ProductDto;
}
