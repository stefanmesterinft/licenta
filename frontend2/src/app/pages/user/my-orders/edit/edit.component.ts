import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OrderService, AuthService, CustomersService } from '@services/index';
import { PasswordsMatch } from '@validators/passwords-match.validator';
import { ROLE } from '@constants/roles';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';

import { SHIPPING_LABELS } from '@constants/shipping-type';
import { STATUS_LABELS } from '@constants/status-type';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditOrderComponent implements OnInit {

  submitted=false;
  selected:any = {};
  clients$: Observable<any>;
  order: any;

  shippings = SHIPPING_LABELS;
  statuses = STATUS_LABELS;
  productsIds: any[] = [];
  maxBirthDate = new Date(Date.now() - 86400000);


  form:FormGroup = new FormGroup({
    address: new FormControl('',[Validators.required]),
    shipping:new FormControl('',[Validators.required]),
    price:new FormControl('',[Validators.required]),
    orderStatus:new FormControl('',[Validators.required]),
    products:new FormControl([],[Validators.required]),
    quantity:new FormControl([],[Validators.required]),
  });

  constructor(private modalref:BsModalRef,
    private ordersService:OrderService,
    private modalService:BsModalService,
    private customersService:CustomersService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    console.log(this.order);
    
    if(this.order){
      this.form.patchValue({...this.order});


      if(this.order.products){
        this.order.products.forEach(element => {
          this.productsIds.push(element.id);
        });

        this.form.patchValue({products: [...this.productsIds]})
      }
      
    }
    this.geTypeahedData();
  }

  geTypeahedData(){
    this.clients$ = typeaheadDefaultObservable(
      this.selected,'customerModel',
      this.customersService,'listTypeahead',
      {'filter[customer.type]': CUSTOMERTYPE.CLIENT}
    )
  }

  selectMatch(event){
    this.form.patchValue({customer: event.item.id});
  }

  dismiss(){
    this.modalref.hide()
  }

  suspend(){

  }
  get f(){ return this.form.controls}

  async submit(){
    this.submitted = true

    if (this.form.invalid || !this.order.id) {
      return
    }
    let data = {...this.form.value};
    data.price = parseInt(data.price);

    this.ordersService.update(this.order.id,data).subscribe((resp:any)=>{
        this.notificationsService.showSuccess('success.account_has_been_edited');
        this.modalService.setDismissReason('success');
        this.dismiss()

    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError('error.something_went_wrong');
      }
    });
  }

}
