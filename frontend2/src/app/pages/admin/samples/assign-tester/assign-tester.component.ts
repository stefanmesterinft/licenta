import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import { Observable, Observer } from 'rxjs';
import { map, switchMap, debounceTime } from 'rxjs/operators';
import { UsersService, SamplesService } from '@services/index';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
 
@Component({
  selector: 'app-add-tester',
  templateUrl: './assign-tester.component.html',
  styleUrls: ['./assign-tester.component.scss']
})
export class AssignTesterComponent implements OnInit {
  public sample: any = {};
  selected:any={}
  testers$:Observable<any>
  constructor(
    private modalService:BsModalService,
    public bsModalRef: BsModalRef,
    private usersService:UsersService,
    private sampleservice:SamplesService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
     this.testers$ = typeaheadDefaultObservable(
      this.selected, "tester", 
      this.usersService, "listTestersTypeahead"
    );
  }

  selectMatch(event){
    if(this.sample.id){
      this.sampleservice.update(this.sample.id, { assigned: event.item.id }).subscribe((resp: any) => {
        this.notificationsService.showSuccess("success.assigned_tester");
        this.modalService.setDismissReason('success');
        this.dismiss()
      }, (res) => {
        this.dismiss();
        if (res.error && res.error.message) {
          this.notificationsService.showError(res.error.message);
        } else {
          this.notificationsService.showError("error.something_went_wrong");
        }
      });
    }else{
     
      this.dismiss()
    }
  }
  dismiss(){
    this.bsModalRef.hide()
  }

}
