import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomersService } from '@services/customers.service';
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

  company:any;
  submitted=false;
  sex = SEX_LABELS;
  races = RACE_LABELS;
  states = STATES_LABELS;

  form:FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    address1:new FormControl('',[Validators.required]),
    address2:new FormControl(undefined),
    city:new FormControl('',[Validators.required]),
    state:new FormControl('',[Validators.required]),
    postalCode:new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required]),
    clia:new FormControl(undefined,[Validators.required]),
    ein:new FormControl(undefined,[Validators.required]),
    type: new FormControl(undefined),
    race_ethnicity: new FormControl('',[Validators.required]),
    sex: new FormControl('',[Validators.required]),
    suspended: new FormControl(false)
  })

  constructor(
    private modalref:BsModalRef,
    private customerService:CustomersService,
    private modalService:BsModalService,
    private notificationsService: NotificationsService
    ) { }

  ngOnInit() {
    if(this.company){
      this.form.patchValue({...this.company});
      if(this.company.hasOwnProperty('suspendedAt')){
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
    if(this.form.invalid || !this.company.id){
      return
    }
    const data = {...this.form.value, type: this.company.type}
    if(data.suspended !== this.company.hasOwnProperty('suspendedAt')){
      await this.customerService.suspend(this.company.id,data.suspended).toPromise();
    }
    this.customerService.update(this.company.id,data).subscribe((resp:any)=>{
      this.notificationsService.showSuccess('success.account_has_been_edited');
      this.modalService.setDismissReason('success');
      this.dismiss();
    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError('error.something_went_wrong');
      }
    })
  }
}