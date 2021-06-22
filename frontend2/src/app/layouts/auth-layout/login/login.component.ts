import { Component, OnInit } from '@angular/core';
import { AuthService, NotificationsService } from '@services/index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls:['login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',Validators.required),
    rememberMe: new FormControl(false),
    smsCode: new FormControl('',[Validators.maxLength(6),Validators.pattern('^[0-9]*$')])
  });

  submitted = false;

  showSms = false;
  smsCode = '';

  userNotFound = false;

  generalError = false;

  requireVerification = false;

  verifyData: any = {};

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService
    ) {
      this.verifyData = this.router.getCurrentNavigation().extras.state || {};
      this.requireVerification = !!this.verifyData.verify;
      this.f.email.setValue(this.verifyData.email || '');
  }

  ngOnInit() {}

  get f(){
    return this.loginForm.controls;
  }

  switchError(errString:string){
    switch (errString) {
      case 'error.user_not_found':
        this.userNotFound = true;
        break;
      default:
        this.generalError=true
        break;
    }
  }
  
  sendSMS(){
    this.submitted=true

    if(this.loginForm.invalid){
      return
    }

    this.authService.sendSMS(this.loginForm.value).subscribe( res => {
      this.showSms = true;
    })
  }

  login(){
    this.submitted=true

    if(this.loginForm.invalid){
      return
    }

    //this.showSms = false;
    this.authService.login(this.loginForm.value).subscribe( (succ) => {
    },(err)=>{
      this.showSms = false;
      if(err && err.error && err.error.message == 'error.login.email_not_confirmed'){
        this.notificationsService.showError('error.login.email_not_confirmed');
        return;
      }

      if(err && err.error && err.error.message){
        this.notificationsService.showError(err.error.message);
      }else {
        this.notificationsService.showError('error.something_went_wrong');
      }
    })
  }

  resendEmail() {
    if(this.verifyData && this.verifyData.email){
      this.authService.resendVerification(this.verifyData.email).subscribe((response:any) => {
        this.notificationsService.showSuccess("success.resend_verification_has_been_sent");
      }, (res) => {
        if(res.error && res.error.message){
          this.notificationsService.showError(res.error.message);
        }else {
          this.notificationsService.showError("error.something_went_wrong");
        }
      });
    }
  }

  toggleSMS(){
    this.showSms = !this.showSms
  }
}