import { Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { ViewOrderComponent } from './view/view.component';


export const OrderRoutes: Routes = [
    {
        path: '',
        component: OrdersComponent,
    },
    {
        path: 'test',
        component: OrdersComponent,
    },
    {
        path: ':id',
        component: ViewOrderComponent,
    },
];
