import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CustomerEntity } from './customer.entity';

@EntityRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {}
