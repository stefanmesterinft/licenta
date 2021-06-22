import { PageMetaDto } from '../../../common/dto/PageMeta.dto';

import { UserDto } from '../../user/dto/User.dto';

export class CustomersMembersPageDto {
    readonly data: UserDto[];
    readonly meta: PageMetaDto;

    constructor(data: UserDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
