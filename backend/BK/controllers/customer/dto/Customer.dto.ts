'use strict';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { CustomerEntity } from '../customer.entity';
import { CustomerType } from '../../../common/constants/customer-type';
import { CustomerSubtype } from '../../../common/constants/customer-subtype';
import { Transform } from 'class-transformer';

export class CustomerDto extends AbstractDto {
    name: string;
    ein: string;
    clia: string;
    @Transform((value:string) => value.toLowerCase())
    email: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    test_introduction: string;
    type: CustomerType;
    subtype: CustomerSubtype;
    suspendedAt?: Date;

    @Transform((value) => `${process.env.BASEURL || ''}${value}`)
    avatar?: string;
    
    constructor(customer: CustomerEntity) {
        super(customer);
        this.name = customer.name;
        this.ein = customer.ein;
        this.clia = customer.clia;
        this.email = customer.email;
        this.phone = customer.phone;
        this.address1 = customer.address1;
        this.address2 = customer.address2;
        this.city = customer.city;
        this.state = customer.state;
        this.postalCode = customer.postalCode;
        this.test_introduction = customer.test_introduction;
        this.type = customer.type;
        this.subtype = customer.subtype;
        if(customer.avatar){
            this.avatar = customer.avatar;
        }
        if(customer.suspendedAt){
            this.suspendedAt = customer.suspendedAt
        }
    }
}
