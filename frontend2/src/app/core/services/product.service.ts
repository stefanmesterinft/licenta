import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/to-query-params.util';

@Injectable()
export class ProductService {
  prefix = '/products';
  constructor(public httpClient: HttpClient) {}

  public list(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}`, {
      params: toQueryParams(pager),
    });
  }
  public listMen(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/men`, {
      params: toQueryParams(pager),
    });
  }
  public listWomen(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/women`, {
      params: toQueryParams(pager),
    });
  }
  public listMenNew(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/men-new`, {
      params: toQueryParams(pager),
    });
  }
  public listWomenNew(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/women-new`, {
      params: toQueryParams(pager),
    });
  }
  public listBrands(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/brands`, {
      params: toQueryParams(pager),
    });
  }

  public listTypeahead(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/typeahead`, {
      params: toQueryParams(pager),
    });
  }

  
  public getProductByCode(code:string) {
    return this.httpClient.get(`${this.prefix}/product/${code}`);
  }

  public get(sampleid) {
    return this.httpClient.get(`${this.prefix}/${sampleid}`);
  }

  public create(sample) {
    return this.httpClient.post(`${this.prefix}`, sample);
  }

  public update(sampleid, sample) {
    return this.httpClient.put(`${this.prefix}/${sampleid}`, sample);
  }

  public delete(sampleid) {
    return this.httpClient.delete(`${this.prefix}/${sampleid}`);
  }
}
