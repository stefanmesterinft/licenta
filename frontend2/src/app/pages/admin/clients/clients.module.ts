import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { RouterModule } from '@angular/router';
import { ClientRoutes } from './clients.routing';
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
  declarations: [ClientsComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(ClientRoutes),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    AvatarModule,
  ],
  entryComponents:[AddComponent,EditComponent]
})
export class AdminClientsModule { }
