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
export class ProductComponent implements OnInit {

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
    console.log(this.selectedSize);
    if(!this.selectedSize){
      this.toastr.show(
        '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Failed to add item to cart!</span> <span data-notify="message">Please select a size</span></div>',
        '',
        {
          timeOut: 8000,
          closeButton: true,
          enableHtml: true,
          tapToDismiss: false,
          titleClass: 'alert-title',
          positionClass: 'toast-top-center',
          toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify",
        }
      );
    }
    else{
      const addedProduct = this.products.find(element => element.size == this.selectedSize);
      this.cartService.create({productId: addedProduct.id,quantity: 1}).subscribe(res => {
        this.toastr.show(
          '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Item added to cart!</span> <span data-notify="message">Your item has been added to cart!</span></div>',
          '',
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            tapToDismiss: false,
            titleClass: 'alert-title',
            positionClass: 'toast-top-center',
            toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify",
          }
        );
    })
  }
}


}
