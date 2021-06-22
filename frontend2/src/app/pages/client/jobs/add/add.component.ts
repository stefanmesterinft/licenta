import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobsService, AuthService } from '@services/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ROLE } from '@constants/roles';
import { CUSTOMERSUBTYPE_LABELS  } from '@constants/customer-subtype';
import moment from 'moment';
import { NotificationsService } from '@services/notifications.service';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

    submitted = false;
    ROLE = ROLE;
    
    subtypes = CUSTOMERSUBTYPE_LABELS;
    maxBirthDate = new Date(Date.now() - 86400000);
    jobForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        estimatedTests: new FormControl(1, [Validators.required,Validators.min(1)]),
        rangeDate: new FormControl([new Date(),new Date()])
    });
    constructor(
        private jobService: JobsService,
        private authService: AuthService,
        private modalService:BsModalService,
        public bsModalRef: BsModalRef,
        private notificationsService: NotificationsService
    ) { }

    ngOnInit() {

    }
    get f() { return this.jobForm.controls; }

    dismiss(){
        this.bsModalRef.hide()
      }
    add() {
        this.submitted = true

        if(this.jobForm.invalid){
            return;
        }

        const data = {
            ...this.jobForm.value,
            startDate: moment(this.jobForm.value.rangeDate[0]).startOf('day').utc().toISOString(),
            endDate: moment(this.jobForm.value.rangeDate[1]).endOf('day').utc().toISOString()
        }

        this.jobService.create(data).subscribe((resp: any) => {
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
