import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@services/index';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { RoutesService } from '@services/routes.service';
import { LayoutService } from '@services/layout.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  dashboard: string;
  breadcrumbs: any;
  page: any = {};
  @Input() fluid: Boolean;

  constructor(
    public authService: AuthService,
    private routesService: RoutesService,
    public layoutService: LayoutService,
    private route: ActivatedRoute,
    private router: Router) {
    this.dashboard = this.authService.dashboardPath();
    this.breadcrumbs = this.routesService.breadcrumbs();
    this.page = this.routesService.currentPage();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe((page) => {
      this.breadcrumbs = this.routesService.breadcrumbs();
      this.page = this.routesService.currentPage();
    });
  }


}
