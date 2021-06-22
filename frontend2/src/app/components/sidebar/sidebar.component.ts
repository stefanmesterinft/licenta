import { Component, OnInit, Input, HostListener, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE } from 'src/app/core/constants/roles';
import { AuthService } from '@services/index';
import { ROUTES } from 'src/app/core/constants/routes';
import { LayoutService } from '@services/layout.service';

const misc: any = {
  sidebar_mini_active: true
};

// Menu Items



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isCollapsed = true;
  dashboard: string;

  constructor(
    private router: Router,
    private authService:AuthService,
    public layoutService: LayoutService) {
    this.menuItems = ROUTES.filter( route => !route.roles || this.authService.hasRole(...route.roles));
    this.dashboard = this.authService.dashboardPath();
  }

  ngOnInit() {
    this.layoutService.sidebarSet(this.menuItems && this.menuItems.length > 0);

    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }

  @HostListener('mouseenter')
  onMouseEnterSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      setTimeout(() => {
        document.body.classList.add('g-sidenav-show');     
      }, 0)
    }
  }
  @HostListener('mouseleave')
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      'sidenav-toggler'
    )[0];
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('g-sidenav-pinned')) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove('g-sidenav-pinned');
      body.classList.remove('g-sidenav-show');
      body.classList.add('g-sidenav-hidden');
      sidenavToggler.classList.remove('active');
      misc.sidebar_mini_active = false;
      this.layoutService.sidebarClose();
    } else {
      body.classList.add('g-sidenav-pinned');
      body.classList.remove('g-sidenav-hidden');
      body.classList.remove('g-sidenav-show');
      sidenavToggler.classList.add('active');
      misc.sidebar_mini_active = true;
      this.layoutService.sidebarClose();
    }
  }
}
