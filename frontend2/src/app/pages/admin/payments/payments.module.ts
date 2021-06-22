import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import { RouterModule } from '@angular/router';
import { PaymentsRoutes } from './payments.routing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [PaymentsComponent],
  imports: [
    CommonModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forChild(PaymentsRoutes)
  ]
})
export class AdminPaymentsModule { }
