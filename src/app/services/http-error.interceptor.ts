import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { delayedRetry } from '../delayedRetry.operator';
import { Injectable } from "@angular/core";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                // Si la llamada falla, reintta hasta 5 veces
                // retry(5),
            
                delayedRetry(500, 3),
                // atrapa el error and y escupe el mensaje de error
                catchError(this.handleError)
            )
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMsg: string;
        if (errorResponse.error instanceof Error) {
            // Error client-side o de red.
            errorMsg = 'An error occurred:' + errorResponse.error.message;
        } else {
            // Error en respuesta del backend
            // checa el cuerpo del response
            errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`;
        }
        return throwError(errorMsg);
    }

} 