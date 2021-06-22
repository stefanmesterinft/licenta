import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MessagesService {
    prefix = '/messages';
    constructor(public httpClient:HttpClient){}


    public sendMessage(messageData,token){
        return this.httpClient.post(`${this.prefix}`, messageData);
    }
}