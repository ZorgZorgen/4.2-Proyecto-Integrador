import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class CacheRouteReuseStrategy implements RouteReuseStrategy {

    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    // lista de paginas que queremos en el cache
    allowRetriveCache = {
        'products': true
    };

    // Reutilizacion de rutas
    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // solicita cache de paginas seleccionadas

        if (this.getPath(before) === 'products/:id' && !curr.queryParamMap.has("refresh") && this.getPath(curr) === 'products') {
            this.allowRetriveCache['products'] = true;
        } else {
            this.allowRetriveCache['products'] = false;
        }
        return before.routeConfig === curr.routeConfig;
    }

    // determinar si se vuelven a agregar las rutas
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        if (this.allowRetriveCache[path]) {
            return this.storedRouteHandles.has(this.getPath(route));
        }
        return false;
    }

    //mismo de arriba, pero para quitar rutas
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        if (this.allowRetriveCache.hasOwnProperty(path)) {
            return true;
        }
        return false;
    }

    // guardar rutas quitadas
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        this.storedRouteHandles.set(this.getPath(route), detachedTree);
    }

    // retomar rutas guardadas
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        return route.pathFromRoot
                .map((el: ActivatedRouteSnapshot) => el.routeConfig ? el.routeConfig.path : '')
                .filter(str => str.length > 0)
                .join('/');
    }
}