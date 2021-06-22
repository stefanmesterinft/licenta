import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { BsModalService } from 'ngx-bootstrap/modal';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import swal from 'sweetalert2';
import { SamplesService } from '@services/samples.service';
import { LayoutService } from '@services/layout.service';
import { CustomersService } from '@services/customers.service';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import { AssignTesterComponent } from './assign-tester/assign-tester.component';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { UsersService } from '@services/users.service';
import moment from 'moment';
import { SAMPLETYPE_LABELS } from '@constants/sample-types';
import { AuthService, NotificationsService } from '@services/index';
import { ROLE } from '@constants/roles';
declare var bwipjs: any;

@Component({
  selector: 'app-admin-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;
  filters: any = {
    customer: '',
    assigned:''
  };

  selected:any = {};
  types = SAMPLETYPE_LABELS;
  testers$: Observable<any>;

  samples$: Observable<any>;
  samplesPager: any = {
    filter: {},
    inited: false,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };
  searchSubscription: Subscription;
  isTesterAdmin: boolean;
  user: any = {};

  constructor(
    private samplesService: SamplesService,
    private layoutService: LayoutService,
    private modalService: BsModalService,
    private usersService: UsersService,
    private authService: AuthService,
    private notificationsService:NotificationsService,
  ) {
    this.isTesterAdmin = this.authService.hasRole(ROLE.TESTER_ADMIN);
    this.user = this.authService.user();
  }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.samplesPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.samplesPager.currentPage);
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
    this.filtersForm.form.valueChanges.subscribe((filters) => this.filterChanged(filters));
  }

  pageChanged(page: number = 1) {
    this.samplesPager.currentPage = page;
    this.samples$ = this.samplesService.list(this.samplesPager).pipe(
      tap((res: any) => { 
        this.samplesPager = { ...this.samplesPager, ...res.meta, inited: true } 
      }),
      map(res => res.data)
    );
  }

  getTypeaheadData(){
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
    this.samplesPager.filter = { };

    /* Add here your filters */
    if(filters.assigned){
      this.samplesPager.filter['sample.assigned_id'] = filters.assigned;
    }

    if(filters.type){
      this.samplesPager.filter['sample.type'] = filters.type;
    }

    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.samplesPager.filter['sample.createdAt'] = dates;
    }

    if(Object.keys(filters).length && this.samplesPager.inited){
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

  edit(sample){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {sample}
    }));
  }

  delete(sample){
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this sample?',
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
        this.samplesService.delete(sample.id).subscribe((resp)=>{
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

  assignTester(sample) {
    this.modalService.show(AssignTesterComponent, ModalDefaultOptions({
      size: 'md',
      data: {sample}
    }));
  }

  checkout(sample){
    swal.fire({
      title: 'Checkout',
      text: 'Are you sure you want to check out this sample?',
      type: 'warning',
      buttonsStyling: true,
      confirmButtonText: 'Checkout',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText: 'cancel',
      confirmButtonClass: 'btn btn-warning'
    }).then((data) => {
      if (data && data.value) {
        this.samplesService.checkout(sample.id).subscribe(()=>{
          this.pageChanged();
        })
      } else {
        // cancel
      }
    });
  }

  checkin(sample){
    swal.fire({
      title: 'Checkin',
      text: 'Are you sure you want to check in this sample?',
      type: 'warning',
      buttonsStyling: true,
      confirmButtonText: 'Checkin',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText: 'cancel',
      confirmButtonClass: 'btn btn-warning'
    }).then((data) => {
      if (data && data.value) {
        this.samplesService.checkin(sample.id).subscribe(()=>{
          this.pageChanged();
        })
      } else {
        // cancel
      }
    });
  }
}
