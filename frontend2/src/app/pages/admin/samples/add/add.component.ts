import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SAMPLETYPE_LABELS } from '@constants/sample-types';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SamplesService } from '@services/samples.service';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CustomersService } from '@services/customers.service';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { NotificationsService } from '@services/notifications.service';
import { typeaheadDefaultObservable } from '@utils/utils';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  customers$:Observable<any>
  selected:any={}
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
  selectMatch(event){

    this.selected.customer = event.value
    this.sampleForm.patchValue({ customer: event.item.id })
  }
  submit() {
    this.submitted = true;
    if(this.sampleForm.invalid){
      return;
    }

    this.sampleService.create(this.sampleForm.value).subscribe((resp: any) => {
      this.notificationsService.showSuccess("success.sample_has_been_created");
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
