import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { AuditEntity } from './audit.entity';

@EntityRepository(AuditEntity)
export class AuditRepository extends Repository<AuditEntity> {}
