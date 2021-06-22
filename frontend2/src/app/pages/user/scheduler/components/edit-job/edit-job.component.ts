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
    return ;
  }

  updateEvent() {
    return ;

  }
}
