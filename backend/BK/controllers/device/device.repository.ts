import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { DeviceEntity } from './device.entity';

@EntityRepository(DeviceEntity)
export class DeviceRepository extends Repository<DeviceEntity> {}
