import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DEVICETYPE_LABELS } from '@constants/device-types';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DevicesService } from '@services/devices.service';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CustomersService } from '@services/customers.service';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  customers$: Observable<any>
  selected: any = {}

  deviceForm = new FormGroup({
    identifier: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    barcode: new FormControl(null, []),
    customer: new FormControl(null, [])
  });
  submitted = false;
  deviceTypes = DEVICETYPE_LABELS

  constructor(private deviceService: DevicesService,
    public modalRef: BsModalRef,
    public customersService: CustomersService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.getTypeaheadData();
  }
  getTypeaheadData() {
    this.customers$ = typeaheadDefaultObservable(
      this.selected, 'customer',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    )
  }
  get f() { return this.deviceForm.controls }

  dismiss() {
    this.modalRef.hide();
  }
  selectMatch(event) {
    this.selected.customer = event.value;
    this.deviceForm.patchValue({ customer: event.item.id })
  }
  submit() {
    this.submitted = true;
    if (this.deviceForm.invalid) {
      return;
    }

    this.deviceService.create(this.deviceForm.value).subscribe((resp: any) => {
      this.notificationsService.showSuccess("success.device_has_been_created");
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
