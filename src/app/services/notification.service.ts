import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { publish, refCount } from "rxjs/operators";
import { AppNotification } from '../appnotification.interface';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

@Injectable()
export class NotificationService {

  private _notification: BehaviorSubject<AppNotification> = new BehaviorSubject(null);
  readonly notification$: Observable<AppNotification> = this._notification.asObservable().pipe(publish(),refCount());
  // publish+refCount: cuando el observer termine, no se reinicia si se agrega un subscriber despues de completarse

  constructor(
      private locationStrategy: LocationStrategy
  ) {}

  notifyMessage(message: string): void {
    let notificationContent:AppNotification = {
        isError: false,
        message: message,
        location: ''
    }
    this.notify(notificationContent);
  }

  notifyError(message: string): void {
    let notificationContent:AppNotification = {
        isError: true,
        message: message,
        location: this.getLocation()
    }
    this.notify(notificationContent);
  }

  private notify(notificationContent:AppNotification): void {
    this._notification.next(notificationContent);
    setTimeout(() => this._notification.next(null), 3000);
  }

  private getLocation(): string {
    return this.locationStrategy instanceof PathLocationStrategy ? this.locationStrategy.path() : '';
  }

}