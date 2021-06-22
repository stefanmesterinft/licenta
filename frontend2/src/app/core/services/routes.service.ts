import { Injectable } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class RoutesService {
    private data: any = {};

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.data = this._routes(this.router.config)
    }

    private _routes(routes: Route[], parent: any = {}, finalRoutes: any = {}): any[] {
        const getFullPath = (path?: string) => {
            if (path && parent.path) {
                return parent.path + '/' + path;
            }

            if (!parent.path && path) {
                return '/' + path;
            }

            return parent.path;
        };

        routes.forEach((route) => {
            const fullPath = getFullPath(route.path);
            let data = route.data ? route.data : {};

            if(parent && parent.path === fullPath){
                data = {...parent, ...data};
            }

            const finalRoute = {
                path: fullPath,
                roles: data.roles || parent.roles || [],
                breadcrumb: data.breadcrumb || {},
                dashboard: !!data.dashboard
            };

            finalRoutes[fullPath] = finalRoute;

            if (route.children && route.children.length > 0) {
                finalRoutes = { ...finalRoutes, ...this._routes(route.children, finalRoute, finalRoutes) };
            }

            if (route.loadChildren) {
                var routerConfig = (<any>route)['_loadedConfig'];
                if (routerConfig && routerConfig.routes.length > 0) {
                    finalRoutes = { ...finalRoutes, ...this._routes(routerConfig.routes, finalRoute, finalRoutes) };
                }
            }
        });

        return finalRoutes;
    }

    private _breadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
        //If no routeConfig is avalailable we are on the root path
        let title = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.title : '';
        let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

        // If the route is dynamic route such as ':id', remove it
        const lastRoutePart = path.split('/').pop();
        const isDynamicRoute = lastRoutePart.startsWith(':');
        if (isDynamicRoute && !!route.snapshot) {
            const paramName = lastRoutePart.split(':')[1];
            path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
            title = route.snapshot.params[paramName];
        }

        //In the routeConfig the complete path is not available,
        //so we rebuild it each time
        const nextUrl = path ? `${url}/${path}` : url;

        const breadcrumb = {
            title: title,
            url: nextUrl,
        };
        // Only adding route with non-empty label
        const newBreadcrumbs = breadcrumb.title ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
        if (route.firstChild) {
            //If we are not on our current path yet,
            //there will be more children to look after, to build our breadcumb
            return this._breadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
    }

    routes() {
        return this.data;
    }

    dashboardByRole(...roles) {
        return Object["values"](this.data).find((route: any) => route.dashboard === true && route.roles.find(role => roles.includes(role)));
    }

    get(path) {
        return Object["values"](this.data).find((route: any) => route.path === path);
    }

    breadcrumbs() {
        return this._breadcrumbs(this.activatedRoute.root);
    }

    currentPage() {
        let child = this.activatedRoute.firstChild;
        while (child) {
            if (child.firstChild) {
                child = child.firstChild;
            } else if (child.snapshot && child.snapshot.data) {
                return child.snapshot.data;
            } else {
                return {};
            }
        }
        return {};
    }
}