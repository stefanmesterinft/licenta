import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '@services/index';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewOrderComponent implements OnInit {

  order: any;
  shippingSum:any = 0;
  constructor(private ordersService: OrderService,private route: ActivatedRoute) {}

  ngOnInit(){
    const orderId = this.route.snapshot.paramMap.get('id');
    this.ordersService.get(orderId).subscribe((res:any) => {
      this.order = res;
      console.log(this.order);
      if(this.order.shipping == "NORMAL"){
        this.shippingSum = 0;
      }
      if(this.order.shipping == "EXPRESS"){
        this.shippingSum = 15;
      }
      if(this.order.shipping == "INSTANT"){
        this.shippingSum = 30;
      } 
    })
  }
}
