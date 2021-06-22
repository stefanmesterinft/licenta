import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/to-query-params.util';

@Injectable()
export class CartService {
  prefix = '/cart';
  constructor(public httpClient: HttpClient) {}

  public list(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}`, {
      params: toQueryParams(pager),
    });
  }

  public listTypeahead(pager: any = {}) {
    return this.httpClient.get(`${this.prefix}/typeahead`, {
      params: toQueryParams(pager),
    });
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

  public userCartDelete() {
    return this.httpClient.delete(`${this.prefix}/user`);
  }
}
