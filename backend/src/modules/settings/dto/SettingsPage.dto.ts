import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { SettingDto } from './Setting.dto';

export class SettingsPageDto {
    readonly data: SettingDto[];
    readonly meta: PageMetaDto;

    constructor(data: SettingDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
