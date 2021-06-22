import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsComponent } from './jobs.component';
import { RouterModule } from '@angular/router';
import { JobsRoutes } from './jobs.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { AvatarModule } from 'ngx-avatar';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';



@NgModule({
  declarations: [JobsComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(JobsRoutes),
    TooltipModule.forRoot(),
    ProgressbarModule.forRoot(),
    AvatarModule
  ],
  entryComponents:[AddComponent]
})
export class ClientJobsModule { }
