import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { STATES_LABELS } from '@constants/states';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { CartService } from '@services/cart.service';
import { NotificationsService } from '@services/notifications.service';
import { OrderService } from '@services/order.service';
import { ProductService } from '@services/product.service';
import { id } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';



@Component({
  selector: "app-cart",
  templateUrl: "cart.component.html"
})
export class CartComponent implements OnInit  {

  cart:any[] = [];
  images : any[] = [];
  totalSum: any = 0;
  sumWithShipping:any = 0;
  checkOut:any = false;
  submitted:any = false;
  shippingMethod:any = 'normal';
  cartPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited: false,
  };
  user:any;
  states = STATES_LABELS;
  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
  });

  constructor(private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private notificationsService: NotificationsService,
    ) 
  {}

  ngOnInit() {
    this.totalSum = 0;
    this.cart = [];
    this.images = [];
    this.cartService.list(this.cartPager).subscribe((res:any) => {
      this.cart = res.data;
      let index = 0;
      this.cart.forEach(element => {
        this.productService.get(element.productId.id).subscribe((res:any) => {
          this.images.push(res.image);
        })
        this.totalSum += (element.productId.price * element.quantity);
      });
      this.sumWithShipping = this.totalSum;
    });

    this.user = this.authService.user()
    this.form.controls['firstName'].setValue(this.user.firstName);
    this.form.controls['lastName'].setValue(this.user.lastName);
    this.form.controls['country'].setValue('Romania');

  }

  get f() {
    return this.form.controls;
  }

  getImage(index: any){    
    if(this.images && this.images[index] && this.images[index].file){
      return environment.baseUrl + '/' + this.images[index].file;
    }    
    return;
  }

  updateQty(action:string,item:any){
    if(action == 'plus'){
      if(item.quantity < 5){
        item.quantity +=1;
      }
      else
      {
        this.toastr.show(
          '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Warning!</span> <span data-notify="message">You can only buy 5 items of this type!</span></div>',
          '',
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            tapToDismiss: false,
            titleClass: 'alert-title',
            positionClass: 'toast-top-center',
            toastClass: "ngx-toastr alert alert-dismissible alert-warning alert-notify",
          }
        );
      }
    }else
    {
      if(item.quantity > 1){
        item.quantity -=1;
      }
      else{
        swal
        .fire({
          title: 'Delete item from cart',
          text: 'Are you sure you want to delete item from cart?',
          type: 'warning',
          buttonsStyling: true,
          confirmButtonText: 'Delete',
          confirmButtonColor: 'red',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonClass: 'btn btn-warning',
        })
        .then((data) => {
          if (data && data.value) {
            // confirmed
            this.cartService.delete(item.id).subscribe((res:any) => {
              this.ngOnInit();
            })
          } else {
            // cancel
          }
        });
      }
    }

  }

  async updateCart(){
    await this.cart.forEach(element => {
      this.cartService.update(element.id,{quantity:element.quantity, productId: element.productId.id, name: element.productId.name}).subscribe(res => {
        console.log(res);
        
        this.totalSum = 0;
        this.cart.forEach(element => {
          this.totalSum += (element.productId.price * element.quantity);
        });
      }, res => {
        console.log(res);

        if (res.error && res.error.message) {
          this.notificationsService.showError(res.error.message);
          this.ngOnInit()
        } else {
          this.notificationsService.showError('Oooppss! Something went wrong!');
        }
      }
      );
    });
  }

  checkOutPage(){
    this.checkOut = true
    this.sumWithShipping = this.totalSum;
  }

  submit(){
    this.submitted = true;
    console.log(this.form);
    

    if(this.form.invalid){
      return
    }
    let data = {
      products: [],
      quantity: [],
      address: this.form.get('country').value + ", " + 
      this.form.get('state').value + ", " + 
      this.form.get('city').value + ", " + 
      this.form.get('address').value + ", " + 
      this.form.get('postalCode').value + ", " + 
      this.form.get('phone').value,
      shipping: this.shippingMethod,
      price: this.sumWithShipping,
      orderStatus: "PLACED"
    };
    this.cart.forEach(element => {
      data.products.push(element.productId.id);
      data.quantity.push(element.quantity);
    });

    this.cartService.userCartDelete().subscribe((res:any) => {
      this.orderService.create(data).subscribe((res:any) => {
        this.toastr.show(
          '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Order placed!</span> <span data-notify="message">Your order has been added placed! A confirmation was sent to your email</span></div>',
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
        this.router.navigate(['/admin/dashboard']);

      })
    })
  }

  onShippingChange(price:number,method:any){
    this.sumWithShipping = this.totalSum + price;
    this.shippingMethod = method;
  }

}