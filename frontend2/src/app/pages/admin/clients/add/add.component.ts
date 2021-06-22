import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CUSTOMERSUBTYPE_LABELS } from '@constants/customer-subtype';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomersService } from '@services/customers.service';
import { AuthService } from '@services/auth.service';
import { PasswordsMatch } from '@validators/passwords-match.validator';
import { ROLE } from '@constants/roles';
import { NotificationsService } from '@services/notifications.service';
import { SEX_LABELS } from '@constants/sex';
import { RACE_LABELS } from '@constants/races';
import { STATES_LABELS } from '@constants/states';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  subtypes = CUSTOMERSUBTYPE_LABELS;
  maxBirthDate = new Date(Date.now() - 86400000);
  submitted=false;

  sex = SEX_LABELS;
  races = RACE_LABELS;
  states = STATES_LABELS;
  
  form:FormGroup = new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    middleName: new FormControl(undefined),
    email: new FormControl('',[Validators.required, Validators.email]),
    dateOfBirth:new FormControl('',[Validators.required]),
    socialSecurityNumber:new FormControl(undefined),
    address1:new FormControl('',[Validators.required]),
    address2:new FormControl(undefined),
    city:new FormControl('',[Validators.required]),
    state:new FormControl('',[Validators.required]),
    postalCode:new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.minLength(8),Validators.required]),
    confirmPassword: new FormControl('',[Validators.required]),
    customerName: new FormControl('',[Validators.required]),
    customerSubtype:new FormControl('',[Validators.required]),
    customerEin:new FormControl(undefined,[Validators.required]),
    race_ethnicity: new FormControl('', []),
    sex: new FormControl('', [])
  },[
    PasswordsMatch
  ])

  constructor(
    private modalref:BsModalRef,
    private authSerivce:AuthService,
    private modalService:BsModalService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
  }

  dismiss(){
    this.modalref.hide()
  }

  get f(){ return this.form.controls}

  submit(){
    this.submitted = true
    if(this.form.invalid){
      return
    }
    const data = {...this.form.value, roles:[ROLE.CLIENT]}
    this.authSerivce.register(data).subscribe((resp:any)=>{
      this.notificationsService.showSuccess("success.account_has_been_created");
      this.modalService.setDismissReason('success');
      this.dismiss()
    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    });
  }
}
