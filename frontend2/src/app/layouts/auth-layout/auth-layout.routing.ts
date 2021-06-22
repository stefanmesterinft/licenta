import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { RegisterComponent } from './register/register.component';
import { AuthLayoutComponent } from './auth-layout.component';
import { EmailResendVerificationComponent } from './email-resend-verification/email-resend-verification.component';
import { EmailResetPasswordComponent } from './email-reset-password/email-reset-password.component';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { EmailSetPasswordComponent } from './email-set-password/email-set-password.component';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';

export const AuthLayoutRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'recover',
        component: PasswordRecoverComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'email/verify/:token',
        component: EmailVerifyComponent
      },
      {
        path: 'email/resend',
        component: EmailResendVerificationComponent
      },
      {
        path: 'reset-password/:token',
        component: EmailResetPasswordComponent
      },
      {
        path: 'set-password/:token',
        component: EmailSetPasswordComponent
      },
      {
        path: 'phone/verify',
        component: VerifyPhoneComponent
      }
    ]
  }
];
