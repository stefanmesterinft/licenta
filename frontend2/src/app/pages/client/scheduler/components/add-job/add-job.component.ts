import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { JobsService } from '@services/jobs.service';
import moment from 'moment';
import { NotificationsService } from '@services/notifications.service';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent implements OnInit {
  dates:{startDate:Date,endDate:Date}
  jobForm = new FormGroup({
    title: new FormControl(null,[Validators.required,Validators.minLength(3)]),
    estimatedTests: new FormControl(1,[Validators.required,Validators.min(1)]),
    rangeDate: new FormControl([new Date(),new Date()],[Validators.required])
  });
  submitted = false;
  constructor(
    private modalService:BsModalService,
    private modalRef:BsModalRef,
    public jobsService:JobsService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    if(this.dates){
      this.f.rangeDate.setValue([this.dates.startDate,this.dates.endDate]);
    }
  }
  get f() { return this.jobForm.controls; }

  dismiss(){
    this.modalRef.hide();
  }
  addNewEvent() {

    this.submitted = true
    if(this.jobForm.invalid){
      return
    }

    const data = {
      ...this.jobForm.value,
      startDate: moment(this.jobForm.value.rangeDate[0]).startOf('day').utc().toISOString(),
      endDate: moment(this.jobForm.value.rangeDate[1]).endOf('day').utc().toISOString()
    }

    this.jobsService.create(data).subscribe((resp: any) => {
      this.notificationsService.showSuccess("success.job_has_been_created");
      this.modalService.setDismissReason('success');
      this.dismiss();
    }, (res) => {
        if (res.error && res.error.message) {
            this.notificationsService.showError(res.error.message);
        } else {
            this.notificationsService.showError("error.something_went_wrong");
        }
    });
  }
}
