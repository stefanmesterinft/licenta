import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { QuestionEntity } from './question.entity';

@EntityRepository(QuestionEntity)
export class QuestionRepository extends Repository<QuestionEntity> {}
