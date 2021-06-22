import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, NotificationsService } from '@services/index';
import { PasswordsMatch } from '@validators/validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: 'email-reset-password.component.html'
})
export class EmailResetPasswordComponent implements OnInit {
  submitted = false;
  token = null;
  form:FormGroup = new FormGroup({
    password: new FormControl('',[Validators.minLength(8),Validators.required]),
    confirmPassword: new FormControl('',[Validators.required]),
  },[
    PasswordsMatch
  ]);


  constructor(
    private authService:AuthService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router:Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];

    if(!this.token){
      this.router.navigate(['/'])
    }
  }

  get f() { return this.form.controls; }

  submit(){
    this.submitted = true;

    if(this.form.invalid){
      return;
    }

    const data = {...this.form.value};
    data.token = this.token;

    this.authService.resetPassword(data).subscribe((response:any) => {
      this.notificationsService.showSuccess("success.reset_password_complete");
      this.router.navigate(['/auth/login']);
    }, (res) => {
      if(res.error && res.error.message){
        if(res.error.statusCode === 404){
          this.notificationsService.showError('error.forgot_password.token_not_valid');
        }else{
          this.notificationsService.showError(res.error.message);
        }
      }else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    });
  }
}
