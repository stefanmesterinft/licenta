import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, NotificationsService } from '@services/index';

@Component({
  selector: 'app-verify',
  templateUrl: 'email-verify.component.html',
})
export class EmailVerifyComponent implements OnInit {
  token = null;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false),
  });
  submitted = false;
  userNotFound = false;
  generalError = false;
  verified = false;
  verifying = false;

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.verifying = true;
    this.token = this.route.snapshot.params['token'];

    if (!this.token) {
      this.router.navigate(['/']);
    }

    this.verify();
  }

  get f() {
    return this.loginForm.controls;
  }

  verify() {
    this.authService.verifyEmail(this.token).subscribe(
      (response: any) => {
        this.verified = true;
        this.verifying = false;
      },
      (res) => {
        this.verified = false;
        this.verifying = false;
      },
    );
  }

  switchError(errString: string) {
    switch (errString) {
      case 'error.user_not_found':
        this.userNotFound = true;
        break;
      default:
        this.generalError = true;
        break;
    }
  }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      (succ) => {
        // console.log(succ);
      },
      (err) => {
        if (
          err &&
          err.error &&
          err.error.message == 'error.login.email_not_confirmed'
        ) {
          this.notificationsService.showError(
            'error.login.email_not_confirmed',
          );
          return;
        }

        if (err && err.error && err.error.message) {
          this.notificationsService.showError(err.error.message);
        } else {
          this.notificationsService.showError('error.something_went_wrong');
        }
      },
    );
  }
}
