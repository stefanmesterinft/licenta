import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from './scheduler.component';
import { RouterModule } from '@angular/router';
import { SchedulerRoutes } from './scheduler.routing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';



@NgModule({
  declarations: [SchedulerComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    RouterModule.forChild(SchedulerRoutes)
  ],
  entryComponents:[AddComponent,EditComponent]
})
export class TesterSchedulerModule { }
