'use strict';
import { AbstractDto } from '../../../common/dto/Abstract.dto';
import { isObject } from 'lodash';
import { SettingEntity } from '../settings.entity';

export class SettingDto extends AbstractDto {
    name:string;
    value: string;
    description?: string;
    options?:string[];

    constructor(setting: SettingEntity) {
        super(setting);
        this.value = setting.value;
        this.description = setting.description;
        this.name = setting.name;
        this.options = setting.options
      
    }
}
