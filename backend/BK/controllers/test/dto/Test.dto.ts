'use strict';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { TestEntity } from '../test.entity';
import { isArray, isObject } from 'lodash';
import { Transform } from 'class-transformer';
import { DeviceDto } from '../../device/dto/Device.dto';
import { UserDto } from '../../user/dto/User.dto';
import { ResultType } from 'common/constants/result-type';
import { TestType } from 'common/constants/test-type';

export class TestDto extends AbstractDto {
    code?: string;
    patient?: any;
    job?: any;
    testers?: UserDto[] = [];
    devices?: DeviceDto[] = [];
    result?: ResultType;
    type?: TestType;
    temperature?: number;
    customer?: any;
    @Transform((value) => value && value.coordinates ? value.coordinates.join(",") : undefined)
    location?: any;
    sample?: any;
    timeInserted?: Date;
    timeResult?: Date;
    reason?: string;
    details?: any;
    questions?: any[];

    constructor(test: TestEntity) {
        super(test);
        this.code = test.code;
        this.patient = test.patient && isObject(test.patient) ? test.patient.toDto() : test.patient;       
        this.job = test.job && isObject(test.job)  ? test.job.toDto() : test.job;      
        this.testers = test.testers && isArray(test.testers) ? test.testers.toDtos() : test.testers;     
        this.devices = test.devices && isArray(test.devices) ? test.devices.toDtos() : test.devices;      
        this.result = test.result;
        this.customer =  test.customer && isObject(test.customer)  ? test.customer.toDto() : test.customer;
        this.temperature = test.temperature;
        this.location = test.location;
        this.sample = test.sample && isObject(test.sample)  ? test.sample.toDto() : test.sample;    
        this.timeInserted = test.timeInserted;
        this.timeResult = test.timeResult;  
        this.reason = test.reason;  
        this.details = test.details;  
        this.questions = test.questions;  
    }
}
