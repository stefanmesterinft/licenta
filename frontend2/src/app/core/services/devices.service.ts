import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/utils';

@Injectable()
export class DevicesService {
    prefix = '/devices';
    constructor(public httpClient:HttpClient){}


    public list(pager: any = {}){
        return this.httpClient.get(`${this.prefix}`, {params: toQueryParams(pager)});
    }

    public get(deviceid){
        return this.httpClient.get(`${this.prefix}/${deviceid}`)
    }

    public create(device){
        return this.httpClient.post(`${this.prefix}`,device)
    }

    public update(deviceid, device){
        return this.httpClient.put(`${this.prefix}/${deviceid}`,device)
    }

    public delete(deviceid){
        return this.httpClient.delete(`${this.prefix}/${deviceid}`)
    }

    public checkout(id){
        return this.httpClient.put(`${this.prefix}/checkout`, {id: id})
    }

    public checkin(id){
        return this.httpClient.put(`${this.prefix}/checkin`, {id: id})
    }
}