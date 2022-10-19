import { environment, config } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = config.adminApiUrl;
  private storageKey: string = 'auth_token';

  getProfile(): Observable<string> {

    if (environment.demo) {

      // Demo 
      return of('Secured info!');

    } else {

      // llamada real...siguen en prueba
      // auth token se envia auto al servidor a http headers con interceptor
      // (auth-interceptor o automaticamente via angular-jwt library)
      return this
        .http
        .get<string>(this.baseUrl);

      // envio de token manual (sin interceptor)
      // const authToken = localStorage.getItem(this.storageKey);
      // const headers = { 'Authorization': `Bearer ${authToken}` };
      // return this
      //   .http
      //   .get<string>(this.baseUrl, { headers });
    }
  }

}
