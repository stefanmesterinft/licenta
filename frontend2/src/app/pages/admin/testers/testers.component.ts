import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, TemplateRef } from '@angular/core';
import { AuthService, UsersService, CustomersService, NotificationsService } from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddTesterComponent } from './add/add.component';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { tap, map, debounceTime, switchMap } from 'rxjs/operators';
import { Subscription, Observable, Observer } from 'rxjs';
import { LayoutService } from '@services/layout.service';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import { EditComponent } from './edit/edit.component';
import { CUSTOMERTYPE } from '@constants/customer-type';
import moment from 'moment';
import { ROLE } from '@constants/roles';

@Component({
  selector: 'app-testers',
  templateUrl: './testers.component.html',
  styleUrls: ['./testers.component.scss']
})
export class TestersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('exampleModal') modalAdd: TemplateRef<any>;
  @ViewChild('filtersForm') filtersForm;
  ROLE = ROLE;
  
  selected:any={}
  customers$:Observable<any>

  roles=[
    {
      value: `{${ROLE.TESTER}}`,
      label:'Tester'
    },
    {
      value: `{${ROLE.TESTER_MONITOR}}`,
      label:'Monitor'
    },
  ]

  filters: any = {};
  testers$: Observable<any>;
  testersPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };
  searchSubscription: Subscription;

  constructor(private usersService: UsersService,
    private modalService: BsModalService,
    private authService: AuthService,
    private layoutService: LayoutService,
    private customersService:CustomersService,
    private notificationsService:NotificationsService,
    private router: Router) { }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.testersPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.testersPager.currentPage);
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
    this.testersPager.currentPage = page;
    this.testers$ = this.usersService.listTesters(this.testersPager).pipe(
      tap((res: any) => { this.testersPager = { ...this.testersPager, ...res.meta, inited: true  } }),
      map(res => res.data)
    );
  }


  getTypeaheadData(){
    this.customers$ = typeaheadDefaultObservable(
      this.selected, 'customer',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER });
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
    this.testersPager.filter = {};

    
    /* Add here your filters */
    if(filters.customer){
      this.testersPager.filter['customer.id'] = filters.customer;
    }
    if(filters.role){
      this.testersPager.filter['user.roles'] = filters.role;
    }
    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.testersPager.filter['customer.createdAt'] = dates;
    }

    if(Object.keys(filters).length && this.testersPager.inited ){
      this.pageChanged();
    }
  }

  add() {
    this.modalService.show(AddTesterComponent,ModalDefaultOptions({}));
  }

  edit(tester) {
    this.modalService.show(EditComponent,ModalDefaultOptions({
      data: {tester}
    }));
  }

  hasRole(role: string) {
    this.authService.hasRole(role);
  }

  presentDevicesModal() {
    this.presentModal()
  }

  presentTestsModal() {
    this.presentModal()
  }

  presentModal() {
    this.modalService.show(this.modalAdd, { class: 'modal-dialog-centered modal-secondary' });
  }

  delete(tester) {
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this tester?',
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
        this.usersService.delete(tester.id).subscribe((resp)=>{
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
