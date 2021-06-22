'use strict';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { AuditEntity } from '../audit.entity';
import { isObject } from 'lodash';

export class AuditDto extends AbstractDto {
    action: string;
    description?: string;
    entityName?: string;
    entityId?: string;
    user?: any;

    constructor(audit: AuditEntity) {
        super(audit);
        this.action = audit.action;
        this.description = audit.description;
        this.entityName = audit.entityName;
        this.entityId = audit.entityId;
        this.user = audit.user && isObject(audit.user) ? audit.user.toDto() : audit.user;
    }
}
