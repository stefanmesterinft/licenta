import { PageOptionsDto } from './PageOptions.dto';

interface IPageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto;
    totalItems : number;
}

export class PageMetaDto {
    readonly currentPage: number;
    readonly itemsPerPage: number;
    readonly totalItems : number;
    readonly totalPages: number;

    constructor({ pageOptionsDto, totalItems  }: IPageMetaDtoParameters) {
        this.currentPage  = pageOptionsDto.currentPage;
        this.itemsPerPage = pageOptionsDto.itemsPerPage;
        this.totalItems  = totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    }
}
