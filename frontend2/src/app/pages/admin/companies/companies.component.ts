import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import swal from 'sweetalert2';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { CustomersService } from '@services/customers.service';
import { LayoutService } from '@services/layout.service';
import { ModalDefaultOptions } from '@utils/utils';
import moment from 'moment';
import { NotificationsService } from '@services/index';

@Component({
  selector: 'app-admin-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;
  filters: any = {};
  customers$: Observable<any>;
  customersPager: any = {
    'filter[customer.type]': CUSTOMERTYPE.TESTER,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };
  searchSubscription: Subscription;
  filtersSubscription: Subscription;

  constructor(
    private customersService: CustomersService,
    private layoutService: LayoutService,
    private modalService: BsModalService,
    private notificationsService:NotificationsService
  ) {
  }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.customersPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.customersPager.currentPage);
      }
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    let previousFilters = {};
    this.filtersSubscription = this.filtersForm.form.valueChanges.pipe(
      debounceTime(300),
    )
      .subscribe((filters) => {
        if (JSON.stringify(this.filters) != JSON.stringify(previousFilters)) {
          previousFilters = { ...this.filters };
          this.filterChanged(filters)
        }
      });
  }

  pageChanged(page: number = 1) {
    this.customersPager.currentPage = page;
    this.customers$ = this.customersService.list(this.customersPager).pipe(
      tap((res: any) => { this.customersPager = { ...this.customersPager, ...res.meta, inited:true } }),
      map(res => res.data)
    );
  }

  filterChanged(filters) {
    this.customersPager.filter = {};
    
    /* Add here your filters */
    if(filters.city){
      this.customersPager.filter['customer.city'] = filters.city;
    }
    if(filters.postalCode){
      this.customersPager.filter['customer.postalCode'] = filters.postalCode;
    }
    if(filters.state){
      this.customersPager.filter['customer.state'] = filters.state;
    }

    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.customersPager.filter['customer.createdAt'] = dates;
    }
    if(Object.keys(filters).length && this.customersPager.inited){
      this.pageChanged();
    }
  }

  trackById(index, item) {
    return item.id;
  }

  add() {
    this.modalService.show(AddComponent, ModalDefaultOptions({}));
  }
  edit(company){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {company}
    }));
  }
  delete(company){
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this company?',
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
        this.customersService.delete(company.id).subscribe((resp)=>{
          this.pageChanged();
        },()=>{
          this.notificationsService.showError('An unknown error occured');
        });
      } else {
        // cancel
      }
    });
  }


  address(item) {
    return [
      item.address1, item.address2,
      item.city, item.state,
      item.postalCode
    ].filter(Boolean).join(', ');
  }

}
