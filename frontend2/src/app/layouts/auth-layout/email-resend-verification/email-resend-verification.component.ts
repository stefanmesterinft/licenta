import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, NotificationsService } from '@services/index';

@Component({
  selector: 'app-resend-verification',
  templateUrl: 'email-resend-verification.component.html'
})
export class EmailResendVerificationComponent implements OnInit {
  submitted = false;
  form:FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
  });

  constructor(
    private authService:AuthService,
    private notificationsService: NotificationsService,
    private router:Router) {}

  ngOnInit() {}

  get f() { return this.form.controls; }

  submit(){
    this.submitted = true;

    if(this.form.invalid){
      return;
    }

    this.authService.resendVerification(this.f.email.value).subscribe((response:any) => {
      this.notificationsService.showSuccess("success.resend_verification_has_been_sent");
      this.form.reset();
      this.submitted = false;
    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    });
  }
}
