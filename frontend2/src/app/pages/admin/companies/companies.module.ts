import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies.component';
import { RouterModule } from '@angular/router';
import { CompaniesRoutes } from './companies.routing';
import { AvatarModule } from 'ngx-avatar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [CompaniesComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(CompaniesRoutes),
    BsDatepickerModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    AvatarModule
  ],
})
export class AdminCompaniesModule { }
