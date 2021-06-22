import { PageMetaDto } from '../../../common/dto/PageMeta.dto';
import { UserDto } from './User.dto';

export class UsersPageDto {
    readonly data: UserDto[];
    readonly meta: PageMetaDto;

    constructor(data: UserDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
