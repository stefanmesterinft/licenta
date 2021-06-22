import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toQueryParams } from '@utils/utils';

@Injectable()
export class TestsService {

    prefix = '/tests';

    constructor(private httpClient: HttpClient){}

    public list(pager: any = {}){
        pager.skipNullResult = true;
        return this.httpClient.get(`${this.prefix}`, {params: toQueryParams(pager)});
    }

    public getTotalByState(){
        return this.httpClient.get(`${this.prefix}/totalByState`)
    }

    public get(testid){
        return this.httpClient.get(`${this.prefix}/${testid}`)
    }

    public create(test){
        return this.httpClient.post(`${this.prefix}`,test)
    }

    public update(testid, test){
        return this.httpClient.put(`${this.prefix}/${testid}`,test)
    }

    public delete(testid){
        return this.httpClient.delete(`${this.prefix}/${testid}`)
    }
    public getTestPDF(testid){
        
        return this.httpClient.get(`${this.prefix}/${testid}/pdf`,
        {
            headers:{
                Accept:'application/pdf'
            },
            responseType:'blob'});
    }

}