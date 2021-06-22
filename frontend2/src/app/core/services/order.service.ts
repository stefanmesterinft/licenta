import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/to-query-params.util';

@Injectable()
export class OrderService {
  prefix = '/orders';
  constructor(public httpClient: HttpClient) {}

  public list(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}`, {
      params: toQueryParams(pager),
    });
  }

  public listMy(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/my`, {
      params: toQueryParams(pager),
    });
  }

  public listTypeahead(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/typeahead`, {
      params: toQueryParams(pager),
    });
  }

  public count(){
    return this.httpClient.get(`${this.prefix}/count`);

  }

  public get(sampleid) {
    return this.httpClient.get(`${this.prefix}/${sampleid}`);
  }

  public create(sample) {
    return this.httpClient.post(`${this.prefix}`, sample);
  }

  public update(sampleid, sample) {    
    return this.httpClient.put<any>(`${this.prefix}/${sampleid}`, sample);
  }

  public delete(sampleid) {
    return this.httpClient.delete(`${this.prefix}/${sampleid}`);
  }

  public userOrderDelete() {
    return this.httpClient.delete(`${this.prefix}/user`);
  }
}
