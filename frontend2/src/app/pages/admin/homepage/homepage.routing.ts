import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { ProductComponent } from './product/product.component';



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
