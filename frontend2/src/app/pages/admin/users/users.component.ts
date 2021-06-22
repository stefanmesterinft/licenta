import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService, UsersService, CustomersService, NotificationsService } from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddUserComponent } from './add/add.component';
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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements  OnInit, OnDestroy, AfterViewInit {

  @ViewChild('filtersForm') filtersForm;
  ROLE = ROLE;
  
  selected:any={}

  roles=[
    {
      value: `{${ROLE.ADMIN}}`,
      label:'Admin'
    },
    {
      value: `{${ROLE.USER}}`,
      label:'User'
    },
  ]

  filters: any = {
    user: '',
    emailConfirmed: '',
    role: ''
  };
  users$: Observable<any>;
  usersTypeahead$: Observable<any>;

  usersPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited:false
  };
  searchSubscription: any;

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
      this.usersPager.q = text || '';
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.usersPager.currentPage);
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
    this.usersPager.currentPage = page;
    this.users$ = this.usersService.list(this.usersPager).pipe(
      tap((res: any) => { this.usersPager = {...this.usersPager, ...res.meta, inited: true } }),
      map(res => res.data)
    );
  }

  getTypeaheadData(){
    this.usersTypeahead$ = typeaheadDefaultObservable(
      this.selected, 
      'user',
      this.usersService, 
      'listUsersTypeahead'
    );
  }


  clearIfEmpty(field){
    const value = this.selected[field];
    
    if((value === undefined || value === '') && this.filters[field]){
      //delete this.filters[field];
      this.filters[field]='';
      this.filterChanged(this.filters);
    }
  }

  selectMatch(name,event){
    this.filters[name] = event.item?.id || event.target?.value
    console.log(event);
    
    this.filterChanged(this.filters);
  }

  filterChanged(filters) {
    this.usersPager.filter = {};
    console.log(filters);
    
    /* Add here your filters */
    if(filters.user){
      this.usersPager.filter['user.id'] = filters.user;
    }

    if(filters.emailConfirmed){
      this.usersPager.filter['user.emailConfirmed'] = filters.emailConfirmed;
    }

    
    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.usersPager.filter['user.createdAt'] = dates;
    }

    if(Object.keys(filters).length && this.usersPager.inited){
      this.pageChanged();
    }
  }

  add() {
    this.modalService.show(AddUserComponent,ModalDefaultOptions({}));
  }

  hasRole(role: string) {
    this.authService.hasRole(role);
  }

  edituser(user){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {user}
    }))
  }

  delete(user) {
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this user?',
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
        this.usersService.delete(user.id).subscribe((resp)=>{
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
