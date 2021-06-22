import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit() {
    const html = document.getElementsByTagName('html')[0];
    // html.classList.add("auth-layout");
    const body = document.getElementsByTagName('body')[0];
    const navbar = document.getElementsByClassName('navbar-horizontal')[0];
    navbar.classList.add('navbar-light');
    navbar.classList.add('navbar-transparent');
  }
  ngOnDestroy() {
    const html = document.getElementsByTagName('html')[0];
    // html.classList.remove("auth-layout");
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('bg-default');
    const navbar = document.getElementsByClassName('navbar-horizontal')[0];
    navbar.classList.remove('navbar-light');
    navbar.classList.remove('navbar-transparent');
  }
}
