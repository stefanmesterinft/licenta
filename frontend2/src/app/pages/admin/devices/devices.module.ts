import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesComponent } from './devices.component';
import { RouterModule } from '@angular/router';
import { DeviceRoutes } from './devices.routing';

import { AvatarModule } from 'ngx-avatar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { AssignTesterComponent } from './assign-tester/assign-tester.component';
import { AssignRenterComponent } from './assign-renter/assign-renter.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
@NgModule({
  declarations: [
    DevicesComponent,
    AddComponent,
    EditComponent,
    AssignTesterComponent,
    AssignRenterComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(DeviceRoutes),
    AvatarModule
  ],
})
export class AdminDevicesModule { }
