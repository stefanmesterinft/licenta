import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService, UsersService, CustomersService, NotificationsService } from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddPatientComponent } from './add/add.component';
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
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements  OnInit, OnDestroy, AfterViewInit {

  @ViewChild('filtersForm') filtersForm;
  ROLE = ROLE;

  selected:any={}
  clients$:Observable<any>


  filters: any = {};
  patients$: Observable<any>;
  patientsPager: any = {
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
      this.patientsPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.patientsPager.currentPage);
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
    this.patientsPager.currentPage = page;
    this.patients$ = this.usersService.listPatients(this.patientsPager).pipe(
      tap((res: any) => { this.patientsPager = {...this.patientsPager, ...res.meta, inited: true } }),
      map(res => res.data)
    );
  }

  getTypeaheadData(){
    this.clients$ = typeaheadDefaultObservable(
      this.selected, 'client',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.CLIENT });
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
    this.patientsPager.filter = {};

    
    /* Add here your filters */
    if(filters.client){
      this.patientsPager.filter['client.id'] = filters.client;
    }
    
    if (filters.startDate || filters.endDate) {
      const dates: any = {};
      if (filters.startDate) {
        dates.start = moment(filters.startDate).startOf('day').utc().toISOString()
      }

      if (filters.endDate) {
        dates.end = moment(filters.endDate).endOf('day').utc().toISOString()
      }

      this.patientsPager.filter['user.createdAt'] = dates;
    }

    if(Object.keys(filters).length && this.patientsPager.inited){
      this.pageChanged();
    }
  }

  add() {
    this.modalService.show(AddPatientComponent,ModalDefaultOptions({}));
  }

  hasRole(role: string) {
    this.authService.hasRole(role);
  }

  editpatient(patient){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {patient}
    }))
  }

  delete(patient) {
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this patient?',
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
        this.usersService.delete(patient.id).subscribe((resp)=>{
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
