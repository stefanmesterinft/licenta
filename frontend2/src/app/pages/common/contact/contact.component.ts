import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthService, MessagesService, NotificationsService } from '@services/index';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  dashboard: string;
  token: string;
  submitted = false;

  GOOGLE_RECAPTCHA_SITE_KEY = environment.google_recaptcha_site_key;
  @ViewChild('reCaptcha') reCaptcha: RecaptchaComponent;

  messageForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl(undefined),
    phone: new FormControl(undefined),
    location: new FormControl(undefined),
    message: new FormControl('', Validators.required),
    recaptcha: new FormControl(null)
  })
  constructor(private router: Router,
    private authService: AuthService,
    private messageService: MessagesService,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.dashboard = this.authService.dashboardPath();
  }

  get f() {
    return this.messageForm.controls;
  }

  async resolved(captchaResponse: string) {
    this.token = captchaResponse;
  }

  submit() {
    this.submitted = true;
    if (this.messageForm.valid) {
      this.messageService.sendMessage(this.messageForm.value, this.token).subscribe(() => {
        this.notificationsService.showSuccess('success.message_sent');
        this.submitted = false;
        this.messageForm.reset();
        this.reCaptcha.reset();
      }, (res) => {
        if (res.error && res.error.message) {
          this.notificationsService.showError(res.error.message);
        } else {
          this.notificationsService.showError("error.something_went_wrong");
        }
        this.reCaptcha.reset();
      })
    }
  }
}
