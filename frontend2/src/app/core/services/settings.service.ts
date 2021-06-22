import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { toQueryParams } from "@utils/utils";

@Injectable()
export class SettingsService {
    prefix = '/settings';
    constructor(public httpClient:HttpClient){}

    list(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/`, {params:toQueryParams(pager)});
    }

    get(id){
        return this.httpClient.get(`${this.prefix}/${id}`);
    }
    update(id,body){
        return this.httpClient.put(`${this.prefix}/${id}`,body);
    }

}