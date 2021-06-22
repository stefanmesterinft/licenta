import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersComponent } from './orders.component';
import { RouterModule } from '@angular/router';
import { OrderRoutes } from './orders.routing';
import { AddOrderComponent } from './add/add.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { EditOrderComponent } from './edit/edit.component';
import { ViewOrderComponent } from './view/view.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';



@NgModule({
  declarations: [MyOrdersComponent,AddOrderComponent, EditOrderComponent, ViewOrderComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(OrderRoutes),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TranslateModule.forChild(),
    AvatarModule
  ],
  entryComponents:[AddOrderComponent]
})
export class UserMyOrdersModule { }
