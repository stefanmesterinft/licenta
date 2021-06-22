import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from '@services/notifications.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss'],
})
export class VerifyPhoneComponent implements OnInit {
  smsCode = '';
  data: any = {};
  verifyCode = false;
  userPhone;
  showInputPhone = false;
  showRetry: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationsService: NotificationsService,
  ) {
    this.data = this.router.getCurrentNavigation().extras.state;
    if (this.data && this.data.phone) {
      this.userPhone = this.data.phone;
    } else {
      this.showInputPhone = true;
    }
  }

  ngOnInit() {}

  showVerifyCode() {
    this.showRetry = false;
    setTimeout(() => {
      this.showRetry = true;
    }, 5000);
    this.verifyCode = true;
  }

  hideVerifyCode() {
    this.showRetry = false;
    this.verifyCode = false;
  }

  sendSMS() {
    if (this.userPhone) {
      this.authService.sendSMS(this.userPhone).subscribe(
        (res) => {
          this.showVerifyCode();
        },
        (err) => {
          if (err && err.error && err.error.message) {
            this.notificationsService.showError(err.error.message);
          } else {
            this.notificationsService.showError(
              'error.phone_verification.no_valid_token_can_be_created',
            );
          }
        },
      );
    } else {
      this.notificationsService.showError(
        'error.phone_verification.no_valid_token_can_be_created',
      );
    }
  }

  verify() {
    this.authService
      .verifySMS(this.smsCode, this.userPhone)
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(['/auth/login']);
      });
  }

  resendEmail() {
    if (this.data && this.data.email) {
      this.authService.resendVerification(this.data.email).subscribe(
        (response: any) => {
          this.notificationsService.showSuccess(
            'success.resend_verification_has_been_sent',
          );
        },
        (res) => {
          if (res.error && res.error.message) {
            this.notificationsService.showError(res.error.message);
          } else {
            this.notificationsService.showError('error.something_went_wrong');
          }
        },
      );
    }
  }
}
