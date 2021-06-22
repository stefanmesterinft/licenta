import { ContextService } from '../../providers/context.service';
import { UserEntity } from '../../modules/user/user.entity';
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
    UpdateEvent,
} from 'typeorm';
import { AuditCreateDto } from 'modules/audit/dto/AuditCreate.dto';
import { InjectConnection } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AuditService } from '../../modules/audit/audit.service';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<any> {
    constructor( 
        @InjectConnection() readonly connection: Connection,
        private readonly auditService: AuditService){ 
           this.connection.subscribers.push(this); 
    }

   
    afterRemove(event: RemoveEvent<any>) {
        const user: UserEntity = ContextService.get("user_key");

        if (event.entityId && event.metadata.name !== "AuditEntity" && user){
            const audit = new AuditCreateDto();
            audit.user = user;
            audit.entityName = event.metadata.name;
            audit.entityId = event.entity?.id || null;
            audit.action = "DELETE";
            audit.description = `Delete made by ${user.email}`;
           

            this.auditService.createAudit(audit);

            console.log('\u001b[' + 31 + 'm' + `Delete made by ${user.email}` + '\u001b[0m');
        }
    }

    afterInsert(event: InsertEvent<any>) {
        const user: UserEntity = ContextService.get("user_key");

        if (event.entity && event.metadata.name !== "AuditEntity" && user) {
            const audit = new AuditCreateDto();
            audit.user = user;
            audit.entityName = event.metadata.name;
            audit.entityId = event.entity?.id || null;
            audit.action = "INSERT";
            audit.description = `Insert made by ${user.email}`;

            this.auditService.createAudit(audit);

            console.log('\u001b[' + 32 + 'm' + `Insert made by ${user.email}` + '\u001b[0m');
        }
    }

    afterUpdate(event: UpdateEvent<any>) {
        const user: UserEntity = ContextService.get("user_key");
        
        if (event.metadata.name !== "AuditEntity" && user) {
            const audit = new AuditCreateDto();
            audit.user = user;
            audit.entityName = event.metadata.name;
            audit.entityId = event.entity?.id || null;
           
           
            if(event.entity && event.entity.delete){
                audit.action = "SOFTDELETE";
                audit.description = `Soft delete made by ${user.email}`;
                console.log('\u001b[' + 31 + 'm' + `Soft delete made by ${user.email}` + '\u001b[0m');
            }else{
                audit.action = "UPDATE";
                audit.description = `Update made by ${user.email}`;
                console.log('\u001b[' + 33 + 'm' + `Update made by ${user.email}` + '\u001b[0m');
            }


            this.auditService.createAudit(audit);
        }
    }
}
