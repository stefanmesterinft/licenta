import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { RouterModule } from '@angular/router';
import { ReportRoutes } from './report.routing';
import { AvatarModule } from 'ngx-avatar';
import { ComponentsModule } from 'src/app/components/components.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';



@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(ReportRoutes),
    TooltipModule.forRoot(),
    AvatarModule
  ]
})
export class ClientReportModule { }
