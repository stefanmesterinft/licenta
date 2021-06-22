import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SampleEntity } from './sample.entity';

@EntityRepository(SampleEntity)
export class SampleRepository extends Repository<SampleEntity> {}
