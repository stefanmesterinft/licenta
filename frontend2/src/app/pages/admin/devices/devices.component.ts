import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, Subscription, Observer } from 'rxjs';
import { tap, map, debounceTime, switchMap, filter } from 'rxjs/operators';

import { BsModalService } from 'ngx-bootstrap/modal';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import swal from 'sweetalert2';
import { DevicesService } from '@services/devices.service';
import { LayoutService } from '@services/layout.service';
import { CustomersService } from '@services/customers.service';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import { AssignTesterComponent } from './assign-tester/assign-tester.component';
import { AssignRenterComponent } from './assign-renter/assign-renter.component';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { UsersService } from '@services/users.service';
import moment from 'moment';
import { DEVICETYPE_LABELS } from '@constants/device-types';
import { NotificationsService } from '@services/notifications.service';
declare var bwipjs: any;

@Component({
  selector: 'app-admin-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;
  filters: any = {
    customer: '',
    renter:'',
    assigned:''
  };

  selected:any = {};
  types = DEVICETYPE_LABELS;
  customers$: Observable<any>;
  renters$:  Observable<any>;
  testers$: Observable<any>;

  devices$: Observable<any>;
  devicesPager: any = {
    filter: {},
    inited: false,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };
  searchSubscription: Subscription;

  constructor(
    private devicesService: DevicesService,
    private layoutService: LayoutService,
    private modalService:BsModalService,
    private customersService:CustomersService,
    private usersService:UsersService,
    private notificationsService:NotificationsService,
  ) {

  }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.devicesPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.devicesPager.currentPage);
      }
    })
    this.getTypeaheadData()
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.filtersForm.form.valueChanges.subscribe((filters, oldValues) => this.filterChanged(filters));
  }

  pageChanged(page: number = 1) {
    this.devicesPager.currentPage = page;
    this.devices$ = this.devicesService.list(this.devicesPager).pipe(
      tap((res: any) => { 
        this.devicesPager = { ...this.devicesPager, ...res.meta, inited: true } 
      }),
      map(res => res.data)
    );
  }

  getTypeaheadData(){
    this.customers$ = typeaheadDefaultObservable(
      this.selected, "customer", 
      this.customersService, "listTypeahead", 
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    );

    this.renters$ = typeaheadDefaultObservable(
      this.selected, "renter", 
      this.customersService, "listTypeahead", 
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    );

    this.testers$ = typeaheadDefaultObservable(
      this.selected, "tester", 
      this.usersService, "listTestersTypeahead"
    );
    
  }

  selectMatch(name,event){
    this.filters[name] = event.item?.id || event.target?.value;
    this.filterChanged(this.filters);
  }


  filterChanged(filters) {
    this.devicesPager.filter = { };

    /* Add here your filters */
    if(filters.customer){
      this.devicesPager.filter['device.customer_id'] = filters.customer;
    }
    if(filters.renter){
      this.devicesPager.filter['device.renter_id'] = filters.renter;
    }
    if(filters.assigned){
      this.devicesPager.filter['device.assigned_id'] = filters.assigned;
    }
    if(filters.type){
      this.devicesPager.filter['device.type'] = filters.type;
    }

    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.devicesPager.filter['device.createdAt'] = dates;
    }

    if(Object.keys(filters).length && this.devicesPager.inited){
      this.pageChanged();
    }
  }

  clearIfEmpty(field){
    const value = this.selected[field];
    if((value === undefined || value === '') && this.filters[field]){
      delete this.filters[field];
      this.filterChanged(this.filters);
    }
  }

  trackById(index, item) {
    return item.id;
  }

  add() {
    this.modalService.show(AddComponent, ModalDefaultOptions({}));
  }

  edit(device){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {device}
    }));
  }

  delete(device){
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this device?',
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
        this.devicesService.delete(device.id).subscribe((resp)=>{
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

  renderBarcode(item) {
    if (item.barcodeRendered) {
      return item.barcodeRendered;
    }

    try {
      // The return value is the canvas element
      let canvas = document.createElement('canvas');
      bwipjs.toCanvas(canvas, {
        bcid: 'azteccode',   
        text: item.barcode,  
        scale: 1 ,            
        width: 20,
        height: 20
      });
      item.barcodeRendered = canvas.toDataURL('image/png');
    } catch (e) {
      item.barcodeRendered = '';
    }

    return item.barcodeRendered;
  }

  assignRenter(device) {
    this.modalService.show(AssignRenterComponent, ModalDefaultOptions({
      size: 'md',
      data: {device}
    }));
  }

  assignTester(device) {
    this.modalService.show(AssignTesterComponent, ModalDefaultOptions({
      size: 'md',
      data: {device}
    }));
  }
}
