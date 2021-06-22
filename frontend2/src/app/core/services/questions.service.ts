import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/utils';

@Injectable()
export class QuestionsService {
    prefix = '/questions';
    constructor(public httpClient:HttpClient){}


    public list(pager: any = {}){
        return this.httpClient.get(`${this.prefix}`, {params: toQueryParams(pager)});
    }

    public listTypeahead(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/typeahead`, {params: toQueryParams(pager)});
    }

    public get(sampleid){
        return this.httpClient.get(`${this.prefix}/${sampleid}`)
    }

    public create(sample){
        return this.httpClient.post(`${this.prefix}`,sample)
    }

    public update(sampleid, sample){
        return this.httpClient.put(`${this.prefix}/${sampleid}`,sample)
    }

    public delete(sampleid){
        return this.httpClient.delete(`${this.prefix}/${sampleid}`)
    }
}