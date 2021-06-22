import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CUSTOMERTYPE } from 'src/app/core/constants/customer-type';
import { tap, map, debounceTime, distinctUntilChanged  } from 'rxjs/operators';
import { CustomersService } from '@services/customers.service';
import { LayoutService } from '@services/layout.service';
import { Subscription } from 'rxjs';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import swal from 'sweetalert2';
import { ModalDefaultOptions } from '@utils/utils';
import moment from 'moment';
import { NotificationsService } from '@services/index';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;
  filters: any = {};
  clients$: Observable<any>;
  clientsPager: any = {
    'filter[customer.type]': CUSTOMERTYPE.CLIENT,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited:false
  };
  searchSubscription: Subscription;
  filtersSubscription: Subscription;

  defaultModalOptions:ModalOptions = {
    keyboard: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-secondary modal-lg'
  }

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
      this.clientsPager.q = text;
      this.pageChanged();
    });
    
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.clientsPager.currentPage);
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
    this.clientsPager.currentPage = page;
    this.clients$ = this.customersService.list(this.clientsPager).pipe(
      tap((res: any) => { this.clientsPager = { ...this.clientsPager, ...res.meta, inited: true } }),
      map(res => res.data)
    );
  }

  filterChanged(filters) {
    this.clientsPager.filter = {};
    /* Add here your filters */

    if(filters.city){
      this.clientsPager.filter['customer.city'] = filters.city;
    }
    if(filters.postalCode){
      this.clientsPager.filter['customer.postalCode'] = filters.postalCode;
    }
    if(filters.state){
      this.clientsPager.filter['customer.state'] = filters.state;
    }

    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.clientsPager.filter['customer.createdAt'] = dates;
    }
    if(Object.keys(filters).length && this.clientsPager.inited){
      this.pageChanged();
    }
  }

  trackById(index, item) {
    return item.id;
  }

  add() {
    this.modalService.show(AddComponent, ModalDefaultOptions({}));
  }

  edit(client){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {client}
    }));
  }

  delete(client){
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this client?',
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
        this.customersService.delete(client.id).subscribe((resp)=>{
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
