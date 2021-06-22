import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime, switchMap, map, ignoreElements } from 'rxjs/operators';
import { SamplesService } from '@services/samples.service';
import { CustomersService } from '@services/customers.service';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { SAMPLETYPE_LABELS } from '@constants/sample-types';
import { NotificationsService } from '@services/notifications.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  sample:any;
  customers$:Observable<any>
  selected:string
  sampleForm = new FormGroup({
    identifier: new FormControl('',Validators.required),
    type: new FormControl('',Validators.required),
    units: new FormControl(0, [Validators.required, Validators.min(1)]),
    barcode: new FormControl(null,[]),
  });
  submitted = false;
  sampleTypes = SAMPLETYPE_LABELS;

  constructor(private sampleService:SamplesService,
    public modalRef:BsModalRef,
    public customersService:CustomersService,
    private modalService:BsModalService,
    private notificationsService: NotificationsService
    ) { }

  ngOnInit() {
    if(this.sample){
      this.sampleForm.patchValue({...this.sample})
    }
  }

  get f(){ return this.sampleForm.controls}

  dismiss(){
    this.modalRef.hide();
  }

  submit(){
    this.submitted = true;
    if(this.sampleForm.invalid  || !this.sample.id){
      return;
    }

    this.sampleService.update(this.sample.id, this.sampleForm.value).subscribe((resp: any) => {
      this.notificationsService.showSuccess("success.device_has_been_edited");
      this.modalService.setDismissReason('success');
      this.dismiss()
    }, (res) => {
      if (res.error && res.error.message) {
        this.notificationsService.showError(res.error.message);
      } else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    });
  }
}

