import { Routes } from '@angular/router';
import { AllProductsComponent } from '@pages/user/homepage/all-products/all-products.component';
import { ProductComponent } from '@pages/user/homepage/product/product.component';
import { HomepageComponent } from './homepage.component';

export const HomepageRoutes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'all-products/:category',
    component: AllProductsComponent
  },
  {
    path: 'product/:id',
    component: ProductComponent
  }
];
