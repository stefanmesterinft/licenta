import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import { Observable, Observer } from 'rxjs';
import { map, switchMap, debounceTime } from 'rxjs/operators';
import { CustomersService, DevicesService } from '@services/index';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { NotificationsService } from '@services/notifications.service';
import { typeaheadDefaultObservable } from '@utils/utils';
 
@Component({
  selector: 'app-add-renter',
  templateUrl: './assign-renter.component.html',
  styleUrls: ['./assign-renter.component.scss']
})
export class AssignRenterComponent implements OnInit {
  public device: any = {};
  selected: any = {};
  customers$:Observable<any>
  constructor(
    private modalService:BsModalService,
    public bsModalRef: BsModalRef,
    private customersService:CustomersService,
    private deviceservice:DevicesService,
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
    if(this.device.id){
      this.deviceservice.update(this.device.id, { renter: event.item.id }).subscribe((resp: any) => {
        this.notificationsService.showSuccess("success.assigned_renter");
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
