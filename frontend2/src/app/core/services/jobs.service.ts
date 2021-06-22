import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/utils';

@Injectable()
export class JobsService {
    prefix = '/jobs';
    constructor(public httpClient:HttpClient){}


    public list(pager: any = {}){
        return this.httpClient.get(`${this.prefix}`, {params: toQueryParams(pager)});
    }

    public listTypeahead(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/typeahead`, {params: toQueryParams(pager)});
    }

    public get(id){
        return this.httpClient.get(`${this.prefix}/${id}`)
    }

    public create(job){
        return this.httpClient.post(`${this.prefix}`,job)
    }

    public update(id, job){
        return this.httpClient.put(`${this.prefix}/${id}`,job)
    }

    public delete(id){
        return this.httpClient.delete(`${this.prefix}/${id}`)
    }

    public assignTester(id, testerId){
        return this.httpClient.put(`${this.prefix}/${id}/assign/tester/${testerId}`, {})
    }
}