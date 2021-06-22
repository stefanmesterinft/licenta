import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/index';
import { ROLE } from 'src/app/core/constants/roles';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {
  dashboard : string;

  constructor(private router:Router, private authService:AuthService) { }

  ngOnInit() {
    this.dashboard = this.authService.dashboardPath();
  }
}
