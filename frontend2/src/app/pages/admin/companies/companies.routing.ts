import { Routes } from '@angular/router';
import { CommonCustomerProfileModule } from '@pages/common/customer-profile/customer-profile.module';
import { CompaniesComponent } from './companies.component';

export const CompaniesRoutes: Routes = [
    {
        path: '',
        component: CompaniesComponent,
    },
    {
        path: 'profile',
        loadChildren: () => CommonCustomerProfileModule,
        data: {
          title: 'Company profile',
          breadcrumbInverted: true
        }
    },
];
