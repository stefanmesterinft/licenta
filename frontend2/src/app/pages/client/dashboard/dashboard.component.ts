import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import Chart from "chart.js";

// core components
import { parseOptions, chartOptions, chartExample2, chartExample3 } from 'src/app/variables/charts';
import { AuthService } from '@services/auth.service';
import { TestsService } from '@services/tests.service';
import { Observable, Subscription } from 'rxjs';
import { TEST_RESULT_LABELS } from '@constants/result-type';
import { CustomersService } from '@services/customers.service';
import { UsersService } from '@services/users.service';
import moment from 'moment';
import { typeaheadDefaultObservable } from '@utils/utils';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { tap, map } from 'rxjs/operators';
import { FileSaverService } from 'ngx-filesaver';
import { JobsService } from '@services/index';
declare var bwipjs: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;

  filters: any = {
    customer: '',
    client: '',
    patient: '',
    tester: '',
    result: ''
  };

  selected: any = {};
  customers$: Observable<any>;
  clients$: Observable<any>;
  patients$: Observable<any>;
  testers$: Observable<any>;
  jobs$: Observable<any>;

  tests$: Observable<any>;
  testsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited: false
  };
  searchSubscription: Subscription;
  isTesterAdmin: Boolean;


  results = TEST_RESULT_LABELS;

  user: any = {};
  totalByStates: any[] = [];

  constructor(
    private testsService: TestsService,
    private customersService: CustomersService,
    private usersService: UsersService,
    private authService: AuthService,
    private jobsService: JobsService,
    private fileSaverService:FileSaverService
  ) {
    this.authService.profile().subscribe((user) => {
      this.user = user;
    })

    this.testsService.getTotalByState().subscribe((data: any[]) => {
      if(Array.isArray(data)){
        this.totalByStates = data;
      }
    });
  }

  ngOnInit() {
    this.pageChanged();
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
      tap((res: any) => { this.testsPager = { ...this.testsPager, ...res.meta, inited: true } }),
      map(res => res.data)
    );
  }

  getTypeaheadData() {
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
    this.testsPager.filter = {};

    /* Add here your filters */
    if(filters.job){
      this.testsPager.filter['job.id'] = filters.job;
    }
    if (filters.customer) {
      this.testsPager.filter['test.customer_id'] = filters.customer;
    }
    if (filters.client) {
      this.testsPager.filter['job.client_id'] = filters.client;
    }
    if (filters.tester) {
      this.testsPager.filter['testers.id'] = filters.tester;
    }
    if (filters.patient) {
      this.testsPager.filter['patient.id'] = filters.patient;
    }
    if (filters.result) {
      this.testsPager.filter['test.result'] = filters.result;
    }
    if (filters.temperature) {
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

    if (Object.keys(filters).length && this.testsPager.inited) {
      this.pageChanged();
    }
  }

  trackById(index, item) {
    return item.id;
  }

  hasRole(role: string) {
    this.authService.hasRole(role);
  }

  renderBarcode(item) {
    if (item.barcode) {
      return item.barcode;
    }

    try {
      // The return value is the canvas element
      const canvas = document.createElement('canvas');
      bwipjs.toCanvas(canvas, {
        bcid: 'azteccode',
        text: item.code,
        scale: 1,
        width: 20,
        height: 20
      });
      item.barcode = canvas.toDataURL('image/png');
    } catch (e) {
      item.barcode = '';
    }

    return item.barcode;
  }
  //  downloadPDF(test){
  //   this.testsService.getTestPDF(test.id).subscribe((printData:Blob)=>{
  //     this.fileSaverService.save(printData, 'ApolloTestResult.pdf');
  //   });
  // }
}
