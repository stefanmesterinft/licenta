import { Routes } from '@angular/router';
import { ProductsComponent } from './view-products.component';
import { ViewProductComponent } from './view-product/product.component';

export const ProductRoutes: Routes = [
    {
        path: '',
        component: ProductsComponent,
    },
    {
        path: 'test',
        component: ProductsComponent,
    },
    {
        path: 'view-product/:id',
        component: ViewProductComponent,
    },
];
