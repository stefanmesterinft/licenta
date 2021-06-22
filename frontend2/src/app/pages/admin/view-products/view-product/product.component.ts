import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { CartService } from '@services/cart.service';
import { ProductService } from '@services/product.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-product',
  templateUrl: 'product.component.html',
  styleUrls: ['./product.component.scss'],

})
export class ViewProductComponent implements OnInit {

  code:any;
  products: any[] = [];
  displayDetails = true;
  displayDetailsCourier = true;
  sizes: any[] = [];
  selectedSize:any;

  productsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited: false,
  };

  constructor(private productsService: ProductService,private route: ActivatedRoute,private cartService: CartService,private toastr: ToastrService) {}

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('id');
    this.productsService.getProductByCode(this.code).subscribe((res:any) => {
      this.products = [...res];
      this.products.forEach(element => {
        this.sizes.push({size: element.size, stock: element.stock});
      });
    })
  }

  getImage(){     
    if(this.products && this.products[0] && this.products[0].image)   
      return environment.baseUrl + '/' + this.products[0].image.file;
    return;
  }

  addToCart(){    
  }
}

