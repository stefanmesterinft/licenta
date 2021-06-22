import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';

import { LoginComponent } from './login/login.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { RegisterComponent } from './register/register.component';
import { AuthLayoutComponent } from './auth-layout.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ComponentsModule } from 'src/app/components/components.module';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { EmailResendVerificationComponent } from './email-resend-verification/email-resend-verification.component';
import { EmailResetPasswordComponent } from './email-reset-password/email-reset-password.component';
import { EmailSetPasswordComponent } from './email-set-password/email-set-password.component';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    PasswordRecoverComponent,
    RegisterComponent,
    EmailVerifyComponent,
    EmailResendVerificationComponent,
    EmailResetPasswordComponent,
    EmailSetPasswordComponent,
    VerifyPhoneComponent
  ]
})
export class AuthLayoutModule {}
