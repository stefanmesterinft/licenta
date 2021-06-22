import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { OrderEntity } from './order.entity';

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {}
