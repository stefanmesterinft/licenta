import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/utils';
import { serialize } from 'object-to-formdata';

@Injectable()
export class UsersService {

    prefix = '/users';

    constructor(private httpClient: HttpClient){}

    public list(pager: any = {}){
        return this.httpClient.get(`${this.prefix}`, {params: toQueryParams(pager)});
    }

    
    public listUsersTypeahead(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/typeahead`, {params: toQueryParams(pager)});
    }

    public listTesters(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/testers`, {params: toQueryParams(pager)});
    }

    public listOthers(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/others`, {params: toQueryParams(pager)});
    }

    public listTestersTypeahead(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/testers/typeahead`, {params: toQueryParams(pager)});
    }

    public listPatients(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/patients`, {params: toQueryParams(pager)});
    }
    public listPatientsTypeahead(pager: any = {}){
        return this.httpClient.get(`${this.prefix}/patients/typeahead`, {params: toQueryParams(pager)});
    }
    public suspend(id,shouldSuspend){
        if(shouldSuspend){
            return this.httpClient.get(`${this.prefix}/suspend/${id}`);
        } else {
            return this.httpClient.get(`${this.prefix}/unsuspend/${id}`);
        }
    }


    public get(id){
        return this.httpClient.get(`${this.prefix}/${id}`)
    }

    public create(user){
        return this.httpClient.post(`${this.prefix}`,user)
    }

    public update(id, user){
        const formData = user instanceof FormData ? user :  serialize(user, {nullsAsUndefineds: true})
        return this.httpClient.put(`${this.prefix}/${id}`,formData)
    }

    public updateProfile(profile){
        const formData = profile instanceof FormData ? profile :  serialize(profile, {nullsAsUndefineds: true})
        return this.httpClient.put(`${this.prefix}/profile`, formData);
    }

    public delete(id){
        return this.httpClient.delete(`${this.prefix}/${id}`)
    }

}