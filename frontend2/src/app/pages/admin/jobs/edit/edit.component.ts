import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CUSTOMERSUBTYPE_LABELS } from '@constants/customer-subtype';
import { JobsService, AuthService, CustomersService } from '@services/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
import moment from 'moment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {


  job: any;
  customers$: Observable<any>;
  clients$: Observable<any>;

  selected: any = {}


  submitted = false;
  jobForm = new FormGroup({
    title: new FormControl('', Validators.required),
    estimatedTests: new FormControl(1, [Validators.required, Validators.min(1)]),
    rangeDate: new FormControl([new Date(), new Date()], Validators.required),
    client: new FormControl('', Validators.required),
    customer: new FormControl(undefined),
  });

  subtypes = CUSTOMERSUBTYPE_LABELS;

  constructor(
    private jobService: JobsService,
    private authService: AuthService,
    private modalService: BsModalService,
    private customersService: CustomersService,
    public bsModalRef: BsModalRef,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.getTypeaheadData();
    if (this.job) {
      this.jobForm.patchValue({
        title: this.job.title,
        estimatedTests: this.job.estimatedTests,
        rangeDate: [new Date(this.job.startDate), new Date(this.job.endDate)]
      });
      if (this.job.customer) {
        this.selected.customerModel = this.job.customer.name;
        this.jobForm.patchValue({ customer: this.job.customer.id })
      }
      if (this.job.client) {
        this.selected.clientModel = this.job.client.name;
        this.jobForm.patchValue({ client: this.job.client.id })
      }
    }

  }

  getTypeaheadData() {

    this.clients$ = typeaheadDefaultObservable(
      this.selected, 'clientModel',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.CLIENT }
    )

    this.customers$ = typeaheadDefaultObservable(
      this.selected, 'customerModel',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    )

  }

  get f() { return this.jobForm.controls; }

  dismiss() {
    this.bsModalRef.hide()
  }

  selectCustomer(event) {

    this.jobForm.patchValue({ customer: event.item.id });
  }

  selectClient(event) {

    this.jobForm.patchValue({ client: event.item.id });

  }

  edit() {
    this.submitted = true

    if (this.jobForm.invalid || !this.job.id) {
      return;
    }

    const data = {
      ...this.jobForm.value,
      startDate: moment(this.jobForm.value.rangeDate[0]).startOf('day').utc().toISOString(),
      endDate: moment(this.jobForm.value.rangeDate[1]).endOf('day').utc().toISOString()
    }

    this.jobService.update(this.job.id, data).subscribe((resp: any) => {
      this.notificationsService.showSuccess("success.job_has_been_edited");
      this.modalService.setDismissReason('success')
      this.dismiss();
    }, (res) => {
      if (res.error && res.error.message) {
        this.notificationsService.showError(res.error.message);
      } else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    })
  }

}