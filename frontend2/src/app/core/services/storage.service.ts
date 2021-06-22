import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    constructor() { }

    public set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public get(key: string): string {
        return localStorage.getItem(key);
    }

    public clear(key: string) {
        localStorage.removeItem(key);
    }

    public clearAll() {
        localStorage.clear();
    }

    // TOKEN

    public getToken(): string {
        return this.get('token');
    }

    public setToken(token: string) {
        this.set('token', token);
    }

    public clearToken() {
        this.clear('token');
    }

    // OBJECTS

    public setObject(key: string, value: any) {
        this.set(key, JSON.stringify(value))
    }

    public getObject(key: string): any {
        return JSON.parse(this.get(key));
    }
}