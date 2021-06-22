
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { JobsService, CustomersService, UsersService, NotificationsService } from '@services/index';
import { Observable, Subscription, Observer } from 'rxjs';
import { tap, map, debounceTime, switchMap } from 'rxjs/operators';
import { LayoutService } from '@services/layout.service';
import moment from 'moment';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import swal from 'sweetalert2';
import { AssignTesterComponent } from './assign-tester/assign-tester.component';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { AuthService } from '@services/index';
import { ROLE } from '@constants/roles';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;
  filters: any = {
    customer: '',
    client:'',
    tester:''
  };

  selected:any = {};
  clients$:  Observable<any>;
  testers$:  Observable<any>;

  jobs$: Observable<any>;
  jobsPager: any = {
    filter: {},
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    initied: false
  };
  searchSubscription: Subscription;
  isTesterAdmin: boolean;

  constructor(
    private modalService: BsModalService,
    private jobsService: JobsService,
    private layoutService: LayoutService,
    private customersService: CustomersService,
    private usersService: UsersService,
    private authService: AuthService,
    private notificationsService:NotificationsService,
  ) {
    this.isTesterAdmin = this.authService.hasRole(ROLE.TESTER_ADMIN)
  }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.jobsPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shoudReload)=>{
      if(shoudReload === 'success'){
        this.pageChanged(this.jobsPager.currentPage);
      }
    });

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
    this.jobsPager.currentPage = page;
    this.jobs$ = this.jobsService.list(this.jobsPager).pipe(
      tap((res: any) => { this.jobsPager = { ...this.jobsPager, ...res.meta, inited:true } }),
      map(res => res.data)
    );
  }


  getTypeaheadData(){
    this.clients$ = typeaheadDefaultObservable(
      this.selected, "client", 
      this.customersService, "listTypeahead", 
      { 'filter[customer.type]': CUSTOMERTYPE.CLIENT }
    );

    this.testers$ = typeaheadDefaultObservable(
      this.selected, "tester", 
      this.usersService, "listTestersTypeahead"
    );
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
    this.jobsPager.filter = { };
    
    /* Add here your filters */
    if(filters.client){
      this.jobsPager.filter['job.client_id'] = filters.client;
    }
    if(filters.tester){
      this.jobsPager.filter['testers.id'] = filters.tester;
    }

    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.jobsPager.filter.period = [
        { 'job.startDate': dates },
        { 'job.endDate': dates }
      ];
    }

    if(Object.keys(filters).length && this.jobsPager.inited ){
      this.pageChanged();
    }
  }

  trackById(index, item) {
    return item.id;
  }

  add() {
    this.modalService.show(AddComponent, ModalDefaultOptions({}));
  }

  edit(job){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {job}
    }));
  }

  delete(job){
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this job?',
      type: 'warning',
      buttonsStyling: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText: 'cancel',
      confirmButtonClass: 'btn btn-warning'
    }).then((data) => {
      if (data && data.value) {
        this.jobsService.delete(job.id).subscribe((resp)=>{
          this.pageChanged();
        },()=>{
          this.notificationsService.showError('An unknown error occured');
        });
      } else {
        // cancel
      }
    });
  }

  assignTester(job) {
    this.modalService.show(AssignTesterComponent, ModalDefaultOptions({
      size: 'md',
      data: {job}
    }));
  }

  progressColor(value){
    if (value < 30) {
      return 'danger';
    }

    if (value < 50) {
      return 'warning';
    }

    if (value < 90) {
      return 'yellow';
    }

    if (value >= 80) {
      return 'success';
    }
    return 'primary';
  }
}
