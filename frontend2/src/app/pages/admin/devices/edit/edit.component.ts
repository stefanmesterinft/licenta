import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DEVICETYPE_LABELS } from '@constants/device-types';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime, switchMap, map, ignoreElements } from 'rxjs/operators';
import { DevicesService } from '@services/devices.service';
import { CustomersService } from '@services/customers.service';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  device: any;
  customers$: Observable<any>;
  selected: any = {};
  deviceForm = new FormGroup({
    identifier: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    barcode: new FormControl(null, []),
    customer: new FormControl(null, [])
  });
  submitted = false;
  deviceTypes = DEVICETYPE_LABELS;

  constructor(private deviceService: DevicesService,
    public modalRef: BsModalRef,
    public customersService: CustomersService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    if (this.device) {
      this.deviceForm.patchValue({
        identifier: this.device.identifier,
        barcode: this.device.barcode,
        type: this.device.type
      })
      if (this.device.customer) {
        this.selected.customer = this.device.customer.name
        this.deviceForm.patchValue({ customer: this.device.customer.id });
      }

    }
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
    this.selected.customer = event.value
    this.deviceForm.patchValue({ customer: event.item.id })
  }
  submit() {
    this.submitted = true;
    if (this.deviceForm.invalid || !this.device.id) {
      return;
    }

    this.deviceService.update(this.device.id, this.deviceForm.value).subscribe((resp: any) => {
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

