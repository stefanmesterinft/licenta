import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/index';
import { NavigationExtras, Router } from '@angular/router';
import {
  CUSTOMERSUBTYPE,
  CUSTOMERSUBTYPE_LABELS,
} from '@constants/customer-subtype';
import { PasswordsMatch } from '@validators/validators';
import { NotificationsService } from '@services/notifications.service';
import moment from 'moment';
import { TITLE_LABELS } from '@constants/titles';
import { STATES_LABELS } from '@constants/states';
import { RecaptchaComponent } from 'ng-recaptcha';
import { environment } from '@environments/environment';
import { REFERER_LABELS } from '../../../core/constants/referers';
import { SEX_LABELS } from '@constants/sex';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  maxBirthDate = new Date(Date.now() - 86400000);

  states = STATES_LABELS;
  sexes = SEX_LABELS;
  submitted = false;


  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      address1: new FormControl('', [Validators.required]),
      address2: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      acceptedPolicy: new FormControl(false, Validators.requiredTrue),
     // recaptcha: new FormControl('', []),
    },
    [PasswordsMatch],
  );

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router,
  ) {}

  get f() {
    return this.form.controls;
  }

  ngOnInit() {}

  register() {
    this.submitted = true;

    const data = { ...this.form.value };

    console.log('asdf34',data);
    
    this.authService.register(data).subscribe(
      (response: any) => {
        console.log('asdf2')
        this.notificationsService.showSuccess('success.account_has_been_registered');

        const verifyData: NavigationExtras = {
          state: {
            phone: data.phone,
            email: data.email,
            verify: 1,
          },
        };

        //this.reCaptcha.reset();
        if (environment.sms_verification) {
          this.router.navigate(['/auth/phone/verify'], verifyData);
        } else {
          this.router.navigate(['/auth/login'], verifyData);
        }
      },
      (res) => {
        if (res.error && res.error.message) {
          this.notificationsService.showError(res.error.message);
        } else {
          this.notificationsService.showError('error.something_went_wrong');
        }
        //this.reCaptcha.reset();
      },
    );
  }
}
