import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { JobEntity } from './job.entity';

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {}
