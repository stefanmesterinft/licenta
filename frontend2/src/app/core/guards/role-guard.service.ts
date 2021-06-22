import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services';
import { ROLE } from '../constants/roles';
import { RoutesService } from '../services/routes.service';
@Injectable()
export class RoleGuardService implements CanActivate {
    constructor(
        public authService: AuthService,
        public router: Router,
        public storageService: StorageService,
        public routesService: RoutesService
    ) { }
    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const expectedRoles = route.data.roles;
        if (expectedRoles && this.authService.hasRole(...expectedRoles)) {
            return true;
        } else {
            const dashboard = this.authService.dashboardPath();

            if (!dashboard) {
                this.authService.logout();
                return false;
            }

            this.router.navigate([dashboard]);

            return false;
        }
    }
}


