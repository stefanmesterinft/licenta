import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/index';
import { ROLE } from 'src/app/core/constants/roles';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  dashboard : string;

  constructor(private router:Router, private authService:AuthService) { }

  ngOnInit() {
    this.dashboard = this.authService.dashboardPath();
  }
}
