import { InjectConnection } from '@nestjs/typeorm';
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';

import { UserEntity } from '../../modules/user/user.entity';
import { UtilsService } from '../../providers/utils.service';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    constructor( 
        @InjectConnection() readonly connection: Connection){ 
           this.connection.subscribers.push(this); 
    }

    listenTo() {
        return UserEntity;
    }
    
    beforeInsert(event: InsertEvent<UserEntity>) {
        if (event.entity && event.entity.password) {
            event.entity.password = UtilsService.generateHash(
                event.entity.password,
            );
        }
    }
    beforeUpdate(event: UpdateEvent<UserEntity>) {
        if (event.entity && event.entity.password) {
            event.entity.password = UtilsService.generateHash(
                event.entity.password,
            );
        }
    }
}
