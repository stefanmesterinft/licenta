'use strict';
import { isArray, isObject } from 'lodash';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { JobEntity } from '../job.entity';
import { UserDto } from 'modules/user/dto/User.dto';
import { CustomerDto } from '../../customer/dto/Customer.dto';

export class JobDto extends AbstractDto {
    estimatedTests: Number;
    title: string;
    testers: UserDto[] = [];
    customer: CustomerDto;
    createdBy: UserDto;
    client: CustomerDto;
    startDate?: Date;
    endDate?: Date;

    totalTests: number;

    constructor(job: JobEntity) {
        super(job);
        this.estimatedTests = job.estimatedTests;
        this.title = job.title;
        this.testers = job.testers && isArray(job.testers) ? job.testers.toDtos() : job.testers;
        this.customer = job.customer && isObject(job.customer) ? job.customer.toDto() : job.customer;
        this.createdBy = job.createdBy && isObject(job.createdBy) ? job.createdBy.toDto() : job.createdBy;
        this.client = job.client && isObject(job.client) ? job.client.toDto() : job.client;
        this.startDate = job.startDate;
        this.endDate = job.endDate;

        this.totalTests = job.totalTests;
    }
}
