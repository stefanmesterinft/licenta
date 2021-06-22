import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TestsService } from '@services/tests.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TEST_RESULT_LABELS } from '@constants/result-type';
import { NotificationsService } from '@services/notifications.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  results = TEST_RESULT_LABELS;
  public test:any;
  submitted = false;
  testForm = new FormGroup({
    temperature: new FormControl('',Validators.required),
    result: new FormControl('')
  });
  constructor(
    private testsService:TestsService,
    private modalService:BsModalService,
    private modalref:BsModalRef,
    private notificationsService: NotificationsService
    ) {
  }
  get f(){ return this.testForm.controls;}
  ngOnInit() {
    if(this.test){
      this.testForm.patchValue({
        temperature: this.test.temperature,
        result: this.test.result || ''
      });
    }
  }
  dismiss(){
    this.modalref.hide();
  }

  update(){
    this.submitted=true;
    
    if(this.testForm.invalid || !this.test.id){
      return
    }

    const data = this.testForm.value;
    data.temperature = parseFloat(data.temperature);

    this.testsService.update(this.test.id,data).subscribe((resp:any)=>{
      this.notificationsService.showSuccess("success.test_has_been_edited");
      this.modalService.setDismissReason('success');
      this.dismiss()
    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    });
  }

}
