import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SettingEntity } from './settings.entity';

@EntityRepository(SettingEntity)
export class SettingsRepository extends Repository<SettingEntity> {}
