import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { VectorMapComponent1 } from './vector-map/vector-map.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AvatarModule } from 'ngx-avatar';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DxVectorMapModule } from 'devextreme-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CollapseModule.forRoot(),
    DxVectorMapModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    AvatarModule,
    TranslateModule.forChild(),
    NgxPaginationModule
  ],
  declarations: [
    FooterComponent,
    VectorMapComponent1,
    NavbarComponent,
    SidebarComponent,
    PaginationComponent,
    BreadcrumbComponent
  ],
  exports: [
    FooterComponent,
    VectorMapComponent1,
    NavbarComponent,
    NgxPaginationModule,
    SidebarComponent,
    PaginationComponent,
    BreadcrumbComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ComponentsModule {}
