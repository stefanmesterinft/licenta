import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
// core components
import { AuthService } from '@services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { TEST_RESULT_LABELS } from '@constants/result-type';
import { UsersService } from '@services/users.service';
import moment from 'moment';

import { typeaheadDefaultObservable } from '@utils/utils';
import { tap, map } from 'rxjs/operators';
import { LayoutService, OrderService } from '@services/index';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;

  filters: any = {

  };

  selected: any = {};
  orders$: Observable<any>;
  users$: Observable<any>;
  ordersCount: any;


  ordersPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited: false
  };
  searchSubscription: Subscription;
  isTesterAdmin: Boolean;
  profile: any = {};
  editMode: boolean = false;
  submitted: boolean = false;
  maxBirthDate = new Date(Date.now() - 86400000);
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    address1: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    sex: new FormControl('',[Validators.required])
  });

  results = TEST_RESULT_LABELS;

  user: any = {};
  totalByStates: any[] = [];

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private ordersService: OrderService,
    private layoutService: LayoutService,
  ) {
    this.authService.profile().subscribe((user) => {
      this.user = user;
    })

  }

  ngOnInit() {
    this.pageChanged();
    this.getTypeaheadData();
    this.ordersService.count().subscribe(res => {this.ordersCount={...res}});
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
    this.ordersPager.currentPage = page;
    this.orders$ = this.ordersService.list(this.ordersPager).pipe(
      tap((res: any) => {
        this.ordersPager = {
          ...this.ordersPager,
          ...res.meta,
          inited: true,
        };        
      }),
      map((res) => res.data),
    );
  }

  getTypeaheadData() {
    this.users$ = typeaheadDefaultObservable(
      this.selected,
      'user',
      this.usersService,
      'listUsersTypeahead',
    );
  }

  clearIfEmpty(field) {
    const value = this.selected[field];

    if ((value === undefined || value === '') && this.filters[field]) {
      delete this.filters[field];
      this.filterChanged(this.filters);
    }
  }

  selectMatch(name, event) {
    this.filters[name] = event.item?.id || event.target?.value
    this.filterChanged(this.filters);
  }

  filterChanged(filters) {
    this.ordersPager.filter = {};

    /* Add here your filters */
    if(filters.order){
      this.ordersPager.filter['order.id'] = filters.order;
    }

    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.ordersPager.filter['test.createdAt'] = dates;
    }

    if (Object.keys(filters).length && this.ordersPager.inited) {
      this.pageChanged();
    }
  }

  setProfile(profile){
    this.profile = profile || {};
    this.profileForm.patchValue({...this.profile});
    if(this.profile.dateOfBirth){
      this.profileForm.patchValue({ dateOfBirth: moment.utc(this.profile.dateOfBirth).toDate() });
    }
  }


  address(){
    return [
        this.profile.address1, this.profile.address2,
        this.profile.city, this.profile.state,
        this.profile.postalCode
    ].filter(Boolean).join(', ');
  }



  edit(){
    this.editMode = true;
  }

  uploadClick(fileUploadField){
    if(!this.editMode){
      return;
    }

    fileUploadField.click();
  }


  cancel(){
    this.editMode = false;
    this.submitted = false;
    this.profileForm.patchValue({...this.profile});
  }
  
}
