import { Injectable, Injector} from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import * as StackTraceParser from 'error-stack-parser';

@Injectable()
export class ErrorService {

  constructor(
    private locationStrategy: LocationStrategy
  ) {
  }

  log(error) {
    // envia error al srvr
    const errorToSend = this.addContextInfo(error);
    return fakeHttpService.post(errorToSend);
  }

  private addContextInfo(error) {
    // detalles del contexto (vienen de otros servicios: UserService...)
    const name = error.name || null;
    const appId = 'Marketplace';
    const user = 'Walter Riedel';
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
    const url = this.locationStrategy.path();
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : this.getStack(error);
    const errorWithContext = {name, appId, user, time, id, url, status, message, stack};
    return errorWithContext;
  }
  
  private getStack(error) {
      try {
          return StackTraceParser.parse(error);
      } catch (error) {
          return '';
      }
  }

}


class fakeHttpService {
  static post(error): Observable<any> {
    console.log('Error enviado al servidor: ', error);
    return of(error);
  }
}