import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService, AuthService, CustomersService } from '@services/index';
import { PasswordsMatch } from '@validators/passwords-match.validator';
import { ROLE } from '@constants/roles';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
import { SEX_LABELS } from '@constants/sex';
import { RACE_LABELS } from '@constants/races';
import { STATES_LABELS } from '@constants/states';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  submitted=false;
  selected:any = {};
  clients$: Observable<any>;
  patient: any;
  sex = SEX_LABELS;
  races = RACE_LABELS;
  states = STATES_LABELS;
  
  maxBirthDate = new Date(Date.now() - 86400000);
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
    password: new FormControl(undefined,Validators.minLength(8)),
    confirmPassword: new FormControl(undefined),
    customer: new FormControl(undefined),
    race_ethnicity: new FormControl('',[Validators.required]),
    sex: new FormControl('',[Validators.required]),
    emailConfirmed: new FormControl(false)
  },[
    PasswordsMatch
  ])

  constructor(private modalref:BsModalRef,
    private usersService:UsersService,
    private modalService:BsModalService,
    private customersService:CustomersService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    if(this.patient){
      this.form.patchValue({...this.patient});

      if(this.patient.dateOfBirth){
        this.form.patchValue({ dateOfBirth: new Date(this.patient.dateOfBirth) });
      }

      if(this.patient.customer){
        this.selected.customerModel = this.patient.customer.name;
        this.form.patchValue({customer:this.patient.customer.id})
      }
    }
    this.geTypeahedData();
  }

  geTypeahedData(){
    this.clients$ = typeaheadDefaultObservable(
      this.selected,'customerModel',
      this.customersService,'listTypeahead',
      {'filter[customer.type]': CUSTOMERTYPE.CLIENT}
    )
  }
  selectMatch(event){

    this.form.patchValue({customer: event.item.id});
  }

  dismiss(){
    this.modalref.hide()
  }

  get f(){ return this.form.controls}

  submit(){
    this.submitted = true

    if (this.form.invalid || !this.patient.id) {
      return
    }
    const data = {...this.form.value}
    this.usersService.update(this.patient.id,data).subscribe((resp:any)=>{
      this.notificationsService.showSuccess("success.account_has_been_edited");
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
