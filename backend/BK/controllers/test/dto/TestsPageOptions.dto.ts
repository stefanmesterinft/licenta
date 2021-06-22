import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/PageOptions.dto';

export class TestsPageOptionsDto extends PageOptionsDto {
    @ApiPropertyOptional({ default: false })
    @IsOptional()
    skipNullResult: Boolean;
}
