import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService, AuthService, CustomersService } from '@services/index';
import { PasswordsMatch } from '@validators/passwords-match.validator';
import { ROLE, ROLES_LABELS } from '@constants/roles';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
import { SEX_LABELS } from '@constants/sex';
import { RACE_LABELS } from '@constants/races';
import { STATES_LABELS } from '@constants/states';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddUserComponent implements OnInit {

  submitted=false;
  selected:any = {};
  users$: Observable<any>;
  user: any;

  sex = SEX_LABELS;
  races = RACE_LABELS;
  states = STATES_LABELS;
  roles = ROLES_LABELS;

  maxBirthDate = new Date(Date.now() - 86400000);
  isAdmin: boolean = false;

  form:FormGroup = new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    middleName: new FormControl(undefined),
    email: new FormControl('',[Validators.required, Validators.email]),
    dateOfBirth:new FormControl('',[]),
    socialSecurityNumber:new FormControl(undefined),
    address1:new FormControl('',[Validators.required]),
    address2:new FormControl(undefined),
    city:new FormControl('',[Validators.required]),
    state:new FormControl('',[Validators.required]),
    postalCode:new FormControl('',[]),
    phone: new FormControl('',[]),
    password: new FormControl(undefined,Validators.minLength(8)),
    confirmPassword: new FormControl(undefined),
    customer: new FormControl(undefined),
    race_ethnicity: new FormControl('',[]),
    sex: new FormControl('',[]),
    emailConfirmed: new FormControl(false),
    roles: new FormControl([]),
    verifier: new FormControl(false),
    device: new FormControl(false),
    suspended: new FormControl(false)
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
  }


  selectMatch(event){
    this.form.patchValue({customer: event.item.id});
  }

  dismiss(){
    this.modalref.hide()
  }

  suspend(){

  }
  get f(){ return this.form.controls}

  async submit(){
    this.submitted = true

    if (this.form.invalid) {
      return
    }
    const data = {...this.form.value, roles:[]};
    if (this.isAdmin == true) {
      data.roles = ['ADMIN']
    }
    else{
      data.roles.push('USER');
    }

    console.log(data,this.roles);

    this.usersService.create(data).subscribe((resp:any)=>{
        this.notificationsService.showSuccess('User created!');
        this.modalService.setDismissReason('success');
        this.dismiss()

    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError('Something went wrong!');
      }
    });
  }

}
