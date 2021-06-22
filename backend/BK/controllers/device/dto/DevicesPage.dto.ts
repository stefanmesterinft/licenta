import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { DeviceDto } from './Device.dto';

export class DevicesPageDto {
    readonly data: DeviceDto[];
    readonly meta: PageMetaDto;

    constructor(data: DeviceDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
