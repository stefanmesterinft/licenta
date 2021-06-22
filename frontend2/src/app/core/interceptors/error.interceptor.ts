import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services';

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        //private errorMessageService: ErrorMessageService,
        private storageService: StorageService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(catchError(error => this.errorHandler(error)));
    }

	/**
  * Customize the default error handler here if needed
  */
    private errorHandler(
        response: HttpResponse<any>
    ): Observable<HttpEvent<any>> {
        if (response.status === 401) {
            this.storageService.clearToken();
            this.router.navigate(['/login'], {
                replaceUrl: true
            });
        } else if (response.status === 400) {
            const errorResponse: any = response;
            if (errorResponse.error) {
                if (errorResponse.error.validation) {
                    errorResponse.error.validation.keys.forEach((key: string) => {
                        // this.errorMessageService.set(
                        // 	errorResponse.error.validation.errors[key],
                        // 	key,
                        // 	response.url
                        // );
                    });
                } else {
                    // this.errorMessageService.set(
                    // 	errorResponse.error.error,
                    // 	'_GLOBAL_',
                    // 	response.url
                    // );
                }
            }
        }
        if (!environment.production) {
            // Do something with the error
            console.error('Request error', response);
        }
        throw response;
    }
}
