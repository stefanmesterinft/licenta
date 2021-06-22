'use strict';
import { Transform } from 'class-transformer';
import { RoleType } from '../../../common/constants/role-type';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { UserEntity } from '../user.entity';
import { isObject } from 'lodash';
import * as moment from 'moment';

export class UserDto extends AbstractDto {
    firstName: string;
    lastName: string;
    @Transform((value:string) => value.toLowerCase())
    email: string;
    emailConfirmed: boolean;
    phone: string;
    phoneConfirmed: boolean;
    @Transform((value) => `${process.env.BASEURL || ''}${value}`)
    avatar?: string;
    @Transform((value) => `${process.env.BASEURL || ''}${value}`)
    cover?: string;
    about?: string;
    roles: RoleType[] = [RoleType.USER];
    
    // If simple user
    middleName?: string;
    dateOfBirth?: Date;
    socialSecurityNumber?: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    existed?: boolean;
    sex: string;
    race_ethnicity?: string;
    age?: number;

    suspendedAt?:Date;

    /** @this UserDto */
    hasRole(...roles: RoleType[]) {
        return this.roles.some((r) => roles.includes(r));
    }

    constructor(user: UserEntity) {
        super(user);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.roles = user.roles;
        this.email = user.email;
        this.emailConfirmed = user.emailConfirmed;
        if (user.avatar) {
            this.avatar = user.avatar;
        }
        if (user.cover) {
            this.cover = user.cover;
        }
        if (user.about) {
            this.about = user.about;
        }
        if (user.phone) {
            this.phone = user.phone;
        }
        this.phoneConfirmed = user.phoneConfirmed;
        if (user.middleName) {
            this.middleName = user.middleName;
        }
        if (user.dateOfBirth) {
            this.dateOfBirth = user.dateOfBirth;
            this.age = moment().diff(this.dateOfBirth, 'years');
        }
        if (user.socialSecurityNumber) {
            this.socialSecurityNumber = user.socialSecurityNumber;
        }
        if (user.address1) {
            this.address1 = user.address1;
        }
        if (user.address2) {
            this.address2 = user.address2;
        }
        if (user.city) {
            this.city = user.city;
        }
        if (user.state) {
            this.state = user.state;
        }
        if (user.postalCode) {
            this.postalCode = user.postalCode;
        }
        if (user.sex) {
            this.sex = user.sex;
        }
        if (user.race_ethnicity) {
            this.race_ethnicity = user.race_ethnicity;
        }
        if (user.suspendedAt){
            this.suspendedAt = user.suspendedAt;
        }
    }
}


