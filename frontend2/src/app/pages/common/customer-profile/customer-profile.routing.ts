import { Routes } from '@angular/router';
import { CustomerProfileComponent } from './customer-profile.component';

export const CustomerProfileRoutes: Routes = [
    {
        path: '',
        component: CustomerProfileComponent,
    },
    {
        path: ':id',
        component: CustomerProfileComponent,
    }
];
