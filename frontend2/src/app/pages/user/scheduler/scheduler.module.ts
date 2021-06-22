import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from './scheduler.component';
import { RouterModule } from '@angular/router';
import { SchedulerRoutes } from './scheduler.routing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddJobComponent } from './components/add-job/add-job.component';
import { EditJobComponent } from './components/edit-job/edit-job.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  declarations: [SchedulerComponent, AddJobComponent, EditJobComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(SchedulerRoutes)
  ],
  entryComponents:[AddJobComponent,EditJobComponent]
})
export class UserSchedulerModule { }
