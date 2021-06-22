import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService, ProductService, CustomersService, NotificationsService } from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddProductComponent } from './add/add.component';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { LayoutService } from '@services/layout.service';
import { Observable } from 'rxjs';
import { EditComponent } from './edit/edit.component';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import { CUSTOMERTYPE } from '@constants/customer-type';
import moment from 'moment';
import { ROLE } from '../../../core/constants/roles';


@Component({
  selector: 'app-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})
export class ProductsComponent implements  OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;
  
  selected:any={}

  filters: any = {
  };
  products$: Observable<any>;
  productsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited:false
  };
  searchSubscription: any;

  constructor(private productsService: ProductService,
    private modalService: BsModalService,
    private authService: AuthService,
    private layoutService: LayoutService,
    private customersService:CustomersService,
    private notificationsService:NotificationsService,
    private router: Router) { }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.productsPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.productsPager.currentPage);
      }
    })
    this.getTypeaheadData();
  }

  
  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.filtersForm.form.valueChanges.subscribe((filters) => this.filterChanged(filters));
  }
  
  pageChanged(page: number = 1) {
    this.productsPager.currentPage = page;
    this.products$ = this.productsService.list(this.productsPager).pipe(
      tap((res: any) => { this.productsPager = {...this.productsPager, ...res.meta, inited: true } }),
      map(res => res.data)
    );
  }

  getTypeaheadData(){
  }


  clearIfEmpty(field){
    const value = this.selected[field];
    
    if((value === undefined || value === '') && this.filters[field]){
      delete this.filters[field];
      this.filterChanged(this.filters);
    }
  }

  selectMatch(name,event){
    this.filters[name] = event.item?.id || event.target?.value
    this.filterChanged(this.filters);
  }

  filterChanged(filters) {
    this.productsPager.filter = {};

    /* Add here your filters */
    
    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.productsPager.filter['product.createdAt'] = dates;
    }

    if(Object.keys(filters).length && this.productsPager.inited){
      this.pageChanged();
    }
  }

  editProduct(product){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {product}
    }))
  }

  viewProduct(product){
    this.router.navigate(['admin','view-products','view-product',product.code])
  }
  

  deleteProduct(product) {
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this product?',
      type: 'warning',
      buttonsStyling: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText: 'cancel',
      confirmButtonClass: 'btn btn-warning'
    }).then((data) => {
      if (data && data.value) {
        // confirmed
        this.productsService.delete(product.id).subscribe((resp)=>{
          this.pageChanged();
        },()=>{
          this.notificationsService.showError('An unknown error occured');
        });
      } else {
        // cancel
      }
    })
  }
}
