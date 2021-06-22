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
import { typeaheadDefaultObservable } from '@utils/utils';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  sample:any;
  customers$:Observable<any>;
  selected:any={};
  sampleForm = new FormGroup({
    identifier: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    units: new FormControl(0, [Validators.required, Validators.min(0)]),
    barcode: new FormControl(null, []),
    customer: new FormControl(null, [])
  });
  submitted = false;
  sampleTypes = SAMPLETYPE_LABELS;

  constructor(private sampleService: SamplesService,
    public modalRef: BsModalRef,
    public customersService: CustomersService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    if (this.sample) {
      if (this.sample.customer) {
        this.selected.customer = this.sample.customer.name
        this.sample.customer = this.sample.customer.id;
      }
      this.sampleForm.patchValue({ ...this.sample })
    }
    this.getTypeaheadData();
  }

  getTypeaheadData(){
    this.customers$ = typeaheadDefaultObservable(
      this.selected, 'customer',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    );
  }

  get f() { return this.sampleForm.controls }

  dismiss() {
    this.modalRef.hide();
  }
  selectMatch(event) {

    this.selected.customer = event.value
    this.sampleForm.patchValue({ customer: event.item.id })
  }
  submit() {
    this.submitted = true;
    if (this.sampleForm.invalid || !this.sample.id) {
      return;
    }

    this.sampleService.update(this.sample.id, this.sampleForm.value).subscribe((resp: any) => {
      this.notificationsService.showSuccess("success.sample_has_been_edited");
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

