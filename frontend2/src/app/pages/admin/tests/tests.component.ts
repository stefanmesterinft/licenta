import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TestsService, AuthService, LayoutService, CustomersService, UsersService, NotificationsService, JobsService } from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import { Observable, Subscription, Observer } from 'rxjs';
import { tap, map, debounceTime, switchMap } from 'rxjs/operators';
import { EditComponent } from './edit/edit.component';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import { CUSTOMERTYPE } from '@constants/customer-type';
import moment from 'moment';
import { TEST_RESULT_LABELS } from '@constants/result-type';
import { FileSaverService } from 'ngx-filesaver';
declare var bwipjs: any;

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;

  filters: any = {
    customer: '',
    client:'',
    patient:'',
    tester:'',
    result:''
  };

  selected:any = {};
  customers$: Observable<any>;
  clients$:  Observable<any>;
  patients$: Observable<any>;
  testers$: Observable<any>;
  jobs$: Observable<any>;

  tests$: Observable<any>;
  testsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited:false
  };
  searchSubscription: Subscription;

  results= TEST_RESULT_LABELS;

  constructor(
    private testsService: TestsService,
    private modalService: BsModalService,
    private layoutService: LayoutService,
    private customersService:CustomersService,
    private usersService:UsersService,
    private notificationsService:NotificationsService,
    private authService: AuthService,
    private jobsService: JobsService,
    private fileSaverService:FileSaverService
    ) { }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.testsPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.testsPager.currentPage);
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
    this.testsPager.currentPage = page;
    this.tests$ = this.testsService.list(this.testsPager).pipe(
      tap((res: any) => { this.testsPager = {...this.testsPager, ...res.meta, inited:true} }),
      map(res => res.data)
    );
  }

  getTypeaheadData(){
    this.customers$ = typeaheadDefaultObservable(
      this.selected, "customer",
      this.customersService, "listTypeahead",
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    );

    this.clients$ = typeaheadDefaultObservable(
      this.selected, "client",
      this.customersService, "listTypeahead",
      { 'filter[customer.type]': CUSTOMERTYPE.CLIENT }
    );

    this.testers$ = typeaheadDefaultObservable(
      this.selected, "tester",
      this.usersService, "listTestersTypeahead"
    );

    this.patients$ = typeaheadDefaultObservable(
      this.selected, "patient",
      this.usersService, "listPatientsTypeahead"
    );

    this.jobs$ = typeaheadDefaultObservable(
      this.selected, "job",
      this.jobsService, "listTypeahead"
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
    this.testsPager.filter = {};

    /* Add here your filters */
    if(filters.job){
      this.testsPager.filter['job.id'] = filters.job;
    }
    if(filters.customer){
      this.testsPager.filter['customer.id'] = filters.customer;
    }
    if(filters.client){
      this.testsPager.filter['job.client_id'] = filters.client;
    }
    if(filters.tester){
      this.testsPager.filter['testers.id'] = filters.tester;
    }
    if(filters.patient){
      this.testsPager.filter['patient.id'] = filters.patient;
    }
    if(filters.result){
      this.testsPager.filter['test.result'] = filters.result;
    }
    if(filters.temperature){
      this.testsPager.filter['test.temperature'] = filters.temperature;
    }

    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.testsPager.filter['test.createdAt'] = dates;
    }

    if(Object.keys(filters).length && this.testsPager.inited ){
      this.pageChanged();
    }
  }

  trackById(index, item ) {
    return item.id;
  }

  edit(test) {
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {test}
    }));
  }
  
  hasRole(role: string) {
    this.authService.hasRole(role);
  }

  delete(test) {
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this test?',
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
        this.testsService.delete(test.id).subscribe((resp)=>{
          this.pageChanged();
        },()=>{
          this.notificationsService.showError('An unknown error occured');
        });
      } else {
        // cancel
      }
    })
  }

  renderBarcode(item) {
    if(item.barcode){
      return item.barcode;
    }

    try {
      // The return value is the canvas element
      let canvas = document.createElement('canvas');
      bwipjs.toCanvas(canvas, {
        bcid: 'azteccode',   
        text: item.code,  
        scale: 1 ,            
        width: 20,
        height: 20
      });
      item.barcode = canvas.toDataURL('image/png');
    } catch (e) {
      item.barcode = '';
    }

    return  item.barcode;
  }

  renderApolloBarcode(item) {
    if(item.barcode){
      return item.barcode;
    }

    try {
      // The return value is the canvas element
      let canvas = document.createElement('canvas');
      bwipjs.toCanvas(canvas, {
        bcid: 'azteccode',   
        text: item.apolloCode,  
        scale: 1 ,            
        width: 20,
        height: 20
      });
      item.barcode = canvas.toDataURL('image/png');
    } catch (e) {
      item.barcode = '';
    }

    return  item.barcode;
  }
  //  downloadPDF(test){
  //   this.testsService.getTestPDF(test.id).subscribe((printData:Blob)=>{
  //     this.fileSaverService.save(printData, 'ApolloTestResult.pdf');
  //   });
  // }

}
