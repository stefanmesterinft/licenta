import { Routes } from '@angular/router';
import { MyOrdersComponent } from './orders.component';
import { ViewOrderComponent } from './view/view.component';


export const OrderRoutes: Routes = [
    {
        path: '',
        component: MyOrdersComponent,
    },
    {
        path: ':id',
        component: ViewOrderComponent,
    },
];
