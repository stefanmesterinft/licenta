import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  baseUrl = environment.baseUrl;
  constructor(private storageService: StorageService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request.url.includes('assets/')){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.storageService.getToken()}`
        },
        url: this.baseUrl + request.url
      });
    }
    return next.handle(request);
  }
}