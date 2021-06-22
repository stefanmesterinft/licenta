import { Routes } from '@angular/router';
import { CommonCustomerProfileModule } from '@pages/common/customer-profile/customer-profile.module';
import { ClientsComponent } from './clients.component';

export const ClientRoutes: Routes = [


    {
        path: '',
        component: ClientsComponent
    },
    {
        path: 'profile',
        loadChildren: () => CommonCustomerProfileModule,
        data: {
          title: 'Client profile',
          breadcrumbInverted: true
        }
    },
];
