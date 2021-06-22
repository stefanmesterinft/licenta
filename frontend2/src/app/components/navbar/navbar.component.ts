import { Component, OnInit, Input } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AuthService } from '@services/index';
import { LayoutService } from '@services/layout.service';
import { RoutesService } from '@services/routes.service';
import { ROLE } from '@constants/roles';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  focus: boolean;
  user: any = null;
  dashboard: string;
  page: any;
  ROLE = ROLE;
  userRole: any;
  searchValue: string;
  @Input() fluid: Boolean;

  constructor(
    public authService: AuthService,
    public layoutService: LayoutService,
    public routesService: RoutesService,
    private router: Router
  ) {

  }

  init(){
    this.user = this.authService.user();    
    this.dashboard = this.authService.dashboardPath();
    console.log(this.dashboard);
    
    this.page = this.routesService.currentPage();
    this.layoutService.searchSet(this.page.search);
  }

  ngOnInit() {
    this.init();

    this.authService.profileChanged.subscribe(() => {
      this.user = this.authService.user();
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.init();

        this.searchValue = undefined;

        if (window.innerWidth < 1200) {
          document.body.classList.remove('g-sidenav-pinned');
          document.body.classList.add('g-sidenav-hidden');
          this.layoutService.sidebarClose();
        }
      }
    });
  }

  onSearch(){
    this.layoutService.searchSetText(this.searchValue)
  }

  openSearch() {
    document.body.classList.add('g-navbar-search-showing');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-showing');
      document.body.classList.add('g-navbar-search-show');
    }, 150);
    setTimeout(function () {
      document.body.classList.add('g-navbar-search-shown');
    }, 300);
  }

  closeSearch() {
    document.body.classList.remove('g-navbar-search-shown');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-show');
      document.body.classList.add('g-navbar-search-hiding');
    }, 150);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hiding');
      document.body.classList.add('g-navbar-search-hidden');
    }, 300);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hidden');
    }, 500);
  }

  openSidebar() {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
      this.layoutService.sidebarClose();
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
      this.layoutService.sidebarOpen();
    }
  }

  toggleSidenav() {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
      this.layoutService.sidebarClose();
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
      this.layoutService.sidebarOpen();
    }
  }

  logout() {
    this.authService.logout();
  }
}
