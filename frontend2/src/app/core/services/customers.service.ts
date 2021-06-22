import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/utils';

@Injectable()
export class CustomersService {
    prefix = '/customers';
    constructor(public httpClient:HttpClient){}


    public list(pager: any = {}){
        return this.httpClient.get(`${this.prefix}`, {params: toQueryParams(pager)});
    }

    public listTypeahead(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/typeahead`, {params: toQueryParams(pager)});
    }

    public members(customerid, pager: any = {}){
        return this.httpClient.get(`${this.prefix}/${customerid}/members`, {params: toQueryParams(pager)});
    }

    public get(customerid){
        return this.httpClient.get(`${this.prefix}/${customerid}`)
    }

    public create(customer){
        return this.httpClient.post(`${this.prefix}`,customer)
    }

    public update(customerid, customer){
        return this.httpClient.put(`${this.prefix}/${customerid}`,customer)
    }

    public delete(customerid){
        return this.httpClient.delete(`${this.prefix}/${customerid}`)
    }

    public suspend(id,shouldSuspend){
        if(shouldSuspend){
            return this.httpClient.get(`${this.prefix}/suspend/${id}`);
        } else {
            return this.httpClient.get(`${this.prefix}/unsuspend/${id}`);
        }
    }
}
