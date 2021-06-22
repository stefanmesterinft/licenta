import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CartEntity } from './cart.entity';

@EntityRepository(CartEntity)
export class CartRepository extends Repository<CartEntity> {}
