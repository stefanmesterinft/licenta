'use strict';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { UserDto } from '../../user/dto/User.dto';
import { DeviceEntity } from '../device.entity';
import { DeviceType } from 'common/constants/device-type';
import { Transform } from 'class-transformer';
import { CustomerDto } from '../../customer/dto/Customer.dto';
import { isObject } from 'lodash';

export class DeviceDto extends AbstractDto {
    identifier: string;
    barcode?: string;
    assigned: UserDto;
    customer: CustomerDto;
    renter: CustomerDto;
    type: DeviceType;
    @Transform((value) => value && value.coordinates ? value.coordinates.join(",") : undefined)
    location?: any;

    constructor(device: DeviceEntity) {
        super(device);
        this.identifier = device.identifier;
        this.barcode = device.barcode;
        this.assigned = device.assigned && isObject(device.assigned) ? device.assigned.toDto() : device.assigned;
        this.customer = device.customer && isObject(device.customer) ? device.customer.toDto() : device.customer;
        this.renter = device.renter && isObject(device.renter) ? device.renter.toDto() : device.renter;
        this.type = device.type;
        this.location = device.location;
    }
}
