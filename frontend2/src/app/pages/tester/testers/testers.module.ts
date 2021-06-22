import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestersComponent } from './testers.component';
import { RouterModule } from '@angular/router';
import { TesterRoutes } from './testers.routing';
import { AddTesterComponent } from './add/add.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { EditComponent } from './edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';



@NgModule({
  declarations: [TestersComponent, AddTesterComponent, EditComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(TesterRoutes),
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TranslateModule.forChild(),
    ReactiveFormsModule,
    AvatarModule
  ],
  entryComponents:[AddTesterComponent]
})
export class TesterTestersModule { }
