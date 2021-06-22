import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { JobsService } from '@services/jobs.service';
import { NotificationsService } from '@services/index';
import moment from 'moment';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent implements OnInit {
  job = null
  jobForm = new FormGroup({
    title: new FormControl(null,[Validators.required,Validators.minLength(3)]),
    estimatedTests: new FormControl(1,[Validators.required,Validators.min(1)]),
    rangeDate: new FormControl([new Date(),new Date()],[Validators.required])
  });
  submitted = false;

  constructor(private modalService:BsModalService,
    private modalRef:BsModalRef,
    public jobsService:JobsService,
    private notificationsService:NotificationsService) { }

  ngOnInit() {
    
    if(this.job){
      this.jobForm.patchValue({
        estimatedTests:this.job.extendedProps.estimatedTests,
        title:this.job.title,
        rangeDate:[this.job.start,this.job.end || this.job.start]
      })
    }
  }
  get f() { return this.jobForm.controls; }

  dismiss(){
    this.modalRef.hide();
  }
  delete() {
    swal
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-danger',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Yes',
        buttonsStyling: false
      })
      .then(result => {
        if (result.value) {
          this.jobsService.delete(this.job.id).subscribe((data:any)=>{

            this.modalService.setDismissReason('success');
            this.dismiss();
          },err=>{
            this.notificationsService.showError('Something went wrong. Please try again');
          });
        }
      });
  }

  updateEvent() {
    this.submitted = true
    if(this.jobForm.invalid || !this.job.id){
      return
    }

    const data = {
      ...this.jobForm.value,
      startDate: moment(this.jobForm.value.rangeDate[0]).startOf('day').utc().toISOString(),
      endDate: moment(this.jobForm.value.rangeDate[1]).endOf('day').utc().toISOString()
    }

    this.jobsService.update(this.job.id, data).subscribe((resp: any) => {
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
