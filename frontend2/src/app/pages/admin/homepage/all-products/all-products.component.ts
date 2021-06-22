import { Component, OnInit } from '@angular/core';
import { ProductService } from '@services/product.service';
import { find } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-all-products',
  templateUrl: 'all-products.component.html',
  styleUrls: ['all-products.component.scss']
})
export class AllProductsComponent implements OnInit {

  allProducts:any;
  products:any = [];
  codes:any = []

  productsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited: false,
  };

  constructor(private productsService: ProductService,private router: ActivatedRoute) {}

  ngOnInit() {
    const category = this.router.snapshot.paramMap.get('category')
    console.log(category);
    
    if(category == 'all'){
      this.productsService.list(this.productsPager).subscribe((res:any) => {
        this.allProducts = res.data;
        this.allProducts.forEach(element => {        
          if(!(this.codes.find(code => code == element.code))){
            this.products.push(element);
            this.codes.push(element.code);
          }
        });      
      })
    }
    if(category == 'men'){
      this.productsService.listMen(this.productsPager).subscribe((res:any) => {
        this.allProducts = res.data;
        this.allProducts.forEach(element => {        
          if(!(this.codes.find(code => code == element.code))){
            this.products.push(element);
            this.codes.push(element.code);
          }
        });      
      })
    }
    if(category == 'women'){
      this.productsService.listWomen(this.productsPager).subscribe((res:any) => {
        this.allProducts = res.data;
        this.allProducts.forEach(element => {        
          if(!(this.codes.find(code => code == element.code))){
            this.products.push(element);
            this.codes.push(element.code);
          }
        });      
      })
    }
    if(category == 'men-new'){
      this.productsService.listMenNew(this.productsPager).subscribe((res:any) => {
        this.allProducts = res.data;
        this.allProducts.forEach(element => {        
          if(!(this.codes.find(code => code == element.code))){
            this.products.push(element);
            this.codes.push(element.code);
          }
        });      
      })
    }
    if(category == 'women-new'){
      this.productsService.listWomenNew(this.productsPager).subscribe((res:any) => {
        this.allProducts = res.data;
        this.allProducts.forEach(element => {        
          if(!(this.codes.find(code => code == element.code))){
            this.products.push(element);
            this.codes.push(element.code);
          }
        });      
      })
    }
    if(category == 'brands'){
      this.productsService.listBrands(this.productsPager).subscribe((res:any) => {
        this.allProducts = res.data;
        this.allProducts.forEach(element => {        
          if(!(this.codes.find(code => code == element.code))){
            this.products.push(element);
            this.codes.push(element.code);
          }
        });      
      })
    }
  }

  getImage(product:any){        
    return environment.baseUrl + '/' +product.image.file;
  }

}
