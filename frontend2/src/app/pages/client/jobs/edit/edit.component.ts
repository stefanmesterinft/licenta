import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CUSTOMERSUBTYPE_LABELS } from '@constants/customer-subtype';
import { JobsService, AuthService, CustomersService } from '@services/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import moment from 'moment';
import { NotificationsService } from '@services/notifications.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {


  job: any;

  submitted = false;
  jobForm = new FormGroup({
    title: new FormControl('', Validators.required),
    estimatedTests: new FormControl(1, [Validators.required, Validators.min(1)]),
    rangeDate: new FormControl([new Date(), new Date()], Validators.required)
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
    if (this.job) {
      this.jobForm.patchValue({
        title: this.job.title,
        estimatedTests: this.job.estimatedTests,
        rangeDate: [new Date(this.job.startDate), new Date(this.job.endDate)]
      });
    }
  }
  get f() { return this.jobForm.controls; }

  dismiss() {
    this.bsModalRef.hide()
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
      this.modalService.setDismissReason('success');
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