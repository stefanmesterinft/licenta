'use strict';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { SampleEntity } from '../sample.entity';
import { SampleType } from 'common/constants/sample-type';
import { Transform } from 'class-transformer';
import { isObject } from 'lodash';
import { UserDto } from '../../user/dto/User.dto';
import { CustomerDto } from '../../customer/dto/Customer.dto';

export class SampleDto extends AbstractDto {
    identifier: string;
    barcode?: string;
    units: number;
    assigned: UserDto;
    customer: CustomerDto;
    type: SampleType;

    @Transform((value) => value && value.coordinates ? value.coordinates.join(",") : undefined)
    location?: any;

    constructor(sample: SampleEntity) {
        super(sample);
        this.identifier = sample.identifier;
        this.barcode = sample.barcode;
        this.units = sample.units;
        this.assigned = sample.assigned && isObject(sample.assigned) ? sample.assigned.toDto() : sample.assigned;
        this.customer = sample.customer && isObject(sample.customer) ? sample.customer.toDto() : sample.customer;
        this.type = sample.type;
        this.location = sample.location;
    }
}
