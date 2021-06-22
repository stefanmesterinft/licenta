import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '@services/notifications.service';
import { ProductService } from '@services/product.service';
import { SIZE_LABELS } from '@constants/size-type'
import { Router } from '@angular/router';
import { FileService } from '@services/file.service';


@Component({
  selector: "app-createProduct",
  templateUrl: "createProduct.component.html"
})
export class CreateProductComponent implements OnInit  {

  product = {};
  imgFile:string;
  size = SIZE_LABELS;
  submitted = false;
  productFile = new FormData();

  form:FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    brand: new FormControl('',[Validators.required]),
    price: new FormControl('',[Validators.required]),
    size: new FormControl('',[Validators.required]),
    stock: new FormControl('',[Validators.required]),
    sex: new FormControl('',[]),
    color: new FormControl('',[]),
    description: new FormControl('',[]),
    material: new FormControl('',[]),
    image: new FormControl([]),
    code: new FormControl('',[Validators.required]),
  })
  constructor(private productService: ProductService,
              private notificationsService: NotificationsService,
              private router: Router,
              private fileService: FileService
            ) 
            {}


  ngOnInit() {}

  onSubmit(){
    this.submitted = true;
    
    if(this.form.invalid){      
      return;
    }

    this.saveProduct(this.form.value);

  }

  get f() { return this.form.controls; }


  saveProduct(product){    
    const data = { ...product,image: this.imgFile };    
    this.productService.create(data).subscribe((newProduct) => {
      this.notificationsService.showSuccess('The product has been saved!');
      this.router.navigate(['/']);
    },(res) => {
      if (res.error && res.error.message) {
        this.notificationsService.showError(res.error.message);
      } else {
        this.notificationsService.showError(
          'Oopps! Something went wrong!',
        );}
      });
  }


  uploadImage(field, event){
    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
      return
    }
    
    const file: File = event.target.files[0];
    const profile = new FormData();

    profile.append('file', file);
    profile.append('title', file.name);

    this.fileService.create(profile).subscribe(
      (resp: any) => {
        this.imgFile = resp.id;
      },
      (res) => {
        if (res.error && res.error.message) {
          this.notificationsService.showError(
            res.error.message
          );
        } else {
          this.notificationsService.showError(
            'error.something_went_wrong'
          );
        }
      },
    );
  }
}

