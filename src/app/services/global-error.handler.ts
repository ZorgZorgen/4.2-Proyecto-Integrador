import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { ErrorService } from './error.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(
    private injector: Injector,
    private notificationService: NotificationService,
    private errorService: ErrorService
    ) {
    super();
  }

  handleError( error: Error | HttpErrorResponse ) {

    // ErrorHandler instanciado antes de Router!
    // Generado por el injector en el runtime
    const router = this.injector.get(Router);

    if (!navigator.onLine) {
      // Error offline
        this.notificationService.notifyError('No Internet Connection');
    } else {
      if (error instanceof HttpErrorResponse) {
        // Handle Http Error (error.status === 403, 404...)
        // Enviar error al servidor
        this.errorService.log(error).subscribe();
        this.notificationService.notifyError(`${error.status} - ${error.message}`);
      } else {
        // Handle Client Error (Angular Error, ReferenceError...)
        // Envia error al servidor y trata de redirigir al usuario a la pagina con detalle
        this.errorService
        .log(error)
        .subscribe(errorWithContextInfo => {
          router.navigate(['/error'], { state: errorWithContextInfo });
        });
      }
    }

    // Dejar que angular loggee el error
    super.handleError( error );
  }
}