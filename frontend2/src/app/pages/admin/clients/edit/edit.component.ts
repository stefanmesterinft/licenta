import { Component, OnInit } from '@angular/core';
import { CUSTOMERSUBTYPE_LABELS } from '@constants/customer-subtype';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomersService } from '@services/customers.service';
import { ROLE } from '@constants/roles';
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
  subtypes =CUSTOMERSUBTYPE_LABELS;
  client:any;
  submitted=false;
  
  sex = SEX_LABELS;
  races = RACE_LABELS;
  states = STATES_LABELS;

  form:FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    address1:new FormControl('',[Validators.required]),
    address2:new FormControl(undefined),
    city:new FormControl('',[Validators.required]),
    state:new FormControl('',[Validators.required]),
    postalCode:new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    password: new FormControl(undefined),
    confirmPassword: new FormControl(undefined),
    subtype: new FormControl(undefined,[Validators.required]),
    ein:new FormControl(undefined,[Validators.required]),
    race_ethnicity: new FormControl('',[Validators.required]),
    sex: new FormControl('',[Validators.required]),
    suspended: new FormControl(false)
  });

  constructor(
    private modalref:BsModalRef,
    private customerService:CustomersService,
    private modalService:BsModalService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    if(this.client){
      this.form.patchValue({...this.client});
      if(this.client.hasOwnProperty('suspendedAt')){
        this.form.patchValue({suspended:true});
      }
    }
  }

  dismiss(){
    this.modalref.hide()
  }

  get f(){ return this.form.controls}

  async submit(){
    this.submitted = true
    if(this.form.invalid || !this.client.id){
      return
    }

    const data = {...this.form.value, type: this.client.type}

    if(data.suspended !== this.client.hasOwnProperty('suspendedAt')){
      await this.customerService.suspend(this.client.id,data.suspended).toPromise();
    }
    this.customerService.update(this.client.id,data).subscribe((resp:any)=>{
      this.notificationsService.showSuccess('success.account_has_been_edited');
      this.modalService.setDismissReason('success');
      this.dismiss()
    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError('error.something_went_wrong');
      }
    });
  }
}
