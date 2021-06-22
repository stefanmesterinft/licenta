import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomersService, JobsService } from '@services/index';
 
import { noop, Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap, debounceTime } from 'rxjs/operators';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { NotificationsService } from '@services/notifications.service';
import { typeaheadDefaultObservable } from '@utils/utils';
 
@Component({
  selector: 'app-add-customer',
  templateUrl: './assign-customer.component.html',
  styleUrls: ['./assign-customer.component.scss']
})
export class AssignCustomerComponent implements OnInit {
  public job: any = {};
  selected: any={};
  customers$:Observable<any>
  constructor(
    private modalService:BsModalService,
    public bsModalRef: BsModalRef,
    private customersService:CustomersService,
    private jobservice:JobsService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    this.customers$ = typeaheadDefaultObservable(
      this.selected, 'customer',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    );
  }

  selectMatch(event){
    if(this.job.id){
      this.jobservice.update(this.job.id,{customer:event.item.id}).subscribe((resp: any) => {
        this.notificationsService.showSuccess("success.assigned_customer");
        this.modalService.setDismissReason('success');
        this.dismiss()
      }, (res) => {
        this.dismiss();
        if (res.error && res.error.message) {
          this.notificationsService.showError(res.error.message);
        } else {
          this.notificationsService.showError("error.something_went_wrong");
        }
      });
    }else{
     
      this.dismiss()
    }
  }
  dismiss(){
    this.bsModalRef.hide()
  }

}
