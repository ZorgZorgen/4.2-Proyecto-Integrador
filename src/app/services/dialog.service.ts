import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  /**
   * Pregunta al usuario que confirme su accion
   * Retorna la promise que resuelve a `true`=confirm o `false`=cancel
   */
  confirm(message?:string) {
    return new Promise<boolean>((resolve, reject) =>
      resolve(window.confirm(message || 'Is it OK?')));
  };
}
