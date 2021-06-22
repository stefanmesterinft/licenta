import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/index';
import { ROLE } from 'src/app/core/constants/roles';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  dashboard : string;

  constructor(private router:Router, private authService:AuthService) { }

  ngOnInit() {
    this.dashboard = this.authService.dashboardPath();
  }

  scrollToEl(el){
    el.scrollIntoView();
  }
}
