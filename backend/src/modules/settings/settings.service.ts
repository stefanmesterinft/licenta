import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { SettingsPageDto } from './dto/SettingsPage.dto';
import { SettingsPageOptionsDto } from './dto/SettingsPageOptions.dto';
import { SettingEntity } from './settings.entity';

import { SettingUpdateDto } from './dto/SettingUpdate.dto';

import { SettingCreateDto } from './dto/SettingCreate.dto';

import { SettingsRepository } from './settings.repository';

@Injectable()
export class SettingsService extends BaseService {
    constructor(
        public readonly settingRepository: SettingsRepository,
        public readonly validatorService: ValidatorService
    ) {
        super();
    }

    protected _getRepository(): Repository<SettingEntity> {
        return this.settingRepository;
    }

    /**
     * Find single setting
     */
    findOne(findData: Partial<SettingEntity>): Promise<SettingEntity> {
       

        return this.settingRepository.findOne(findData);
    }

    async findById(id: string): Promise<SettingEntity> {
        const setting = await this.findOne({id: id});

        return setting;
    }

    async createSetting(settingDto: SettingCreateDto): Promise<SettingEntity> {
        const setting = this.settingRepository.create(settingDto);
        return this.settingRepository.save(setting);
      
    }

    async getSettings(pageOptionsDto: SettingsPageOptionsDto): Promise<SettingsPageDto> {
                
        const queryBuilder = this.settingRepository.createQueryBuilder('setting');

        let searchFields = ['setting.name', 'setting.description', 'setting.value'];
       

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "setting");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new SettingsPageDto(items.toDtos(), pageMetaDto);
    }

    async updateSetting(id: string, settingData: SettingUpdateDto): Promise<SettingEntity> {
        

        await this.settingRepository.save({id: id, ...settingData});

        return this.findById(id);
    }

    async deletesetting(id: string): Promise<boolean> {
        const setting = await this.findById(id);
        if (!setting) {
            throw new NotFoundException();
        }
        await this.settingRepository.softRemove({id: id, delete: true});
        return true;
    }
    async findByName(name:string): Promise<SettingEntity>{
        return this.settingRepository.findOne({name:name});
    }
}
