import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AlternativeComponent } from './alternative/alternative.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AlternativeComponent
  }
];
