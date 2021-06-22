import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CUSTOMERSUBTYPE } from '@constants/customer-subtype';
import { JobsService } from '@services/jobs.service';
import { AuthService } from '@services/auth.service';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CustomersService } from '@services/customers.service';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
import moment from 'moment';

@Component({
    selector: 'app-add-job',
    templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {

    customers$
    clients$

    selected:any={}

    submitted = false;
    jobForm = new FormGroup({
        title: new FormControl('', Validators.required),
        estimatedTests: new FormControl(1, [Validators.required,Validators.min(1)]),
        rangeDate: new FormControl([new Date(),new Date()],Validators.required),
        client: new FormControl('',Validators.required),
        customer:new FormControl(undefined)
    });

    constructor(private jobService: JobsService,
        private authService: AuthService,
        private modalService:BsModalService,
        private customersService:CustomersService,
        public bsModalRef: BsModalRef,
        private notificationsService: NotificationsService
    ) { }

    ngOnInit() {
        this.geTypeahedData();
    }

    geTypeahedData(){

        this.clients$ = typeaheadDefaultObservable(
          this.selected,'clientModel',
          this.customersService,'listTypeahead',
          {'filter[customer.type]': CUSTOMERTYPE.CLIENT}
        )

        this.customers$ = typeaheadDefaultObservable(
            this.selected,'customerModel',
            this.customersService,'listTypeahead',
            {'filter[customer.type]': CUSTOMERTYPE.TESTER}
        )
      }

    get f() { return this.jobForm.controls; }


    selectCustomer(event){
        this.jobForm.patchValue({customer:event.item.id});
    }

    selectClient(event){
        this.jobForm.patchValue({client:event.item.id});
    }

    dismiss(){
        this.bsModalRef.hide()
    }

    add() {
        this.submitted = true
        if(this.jobForm.invalid){
            return;
        }

        const data = { 
            ...this.jobForm.value,
            startDate: moment(this.jobForm.value.rangeDate[0]).startOf('day').utc().toISOString(),
            endDate: moment(this.jobForm.value.rangeDate[1]).endOf('day').utc().toISOString()
        }

        this.jobService.create(data).subscribe((resp:any)=>{
            this.notificationsService.showSuccess("success.job_has_been_created");
            this.modalService.setDismissReason('success')
            this.dismiss();
        }, (res) => {
            if(res.error && res.error.message){
              this.notificationsService.showError(res.error.message);
            }else {
              this.notificationsService.showError("error.something_went_wrong");
            }
        })
    }

}
