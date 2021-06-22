import { Component, OnInit,  ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { TestsService, LayoutService, SettingsService, NotificationsService } from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, } from 'rxjs';
import { tap, map, } from 'rxjs/operators';


@Component({
  selector: 'app-tests',
  templateUrl: './settings.component.html',
  // styleUrls: ['./tests.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filtersForm') filtersForm;

  filters: any = {
    customer: '',
    client:'',
    patient:'',
    tester:'',
    result:''
  };

  selected:any = {};

  settings$: Observable<any>;

  settingsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited:false
  };
  searchSubscription: Subscription;


  constructor(
    private settingsService: SettingsService,
    private modalService: BsModalService,
    private layoutService: LayoutService,
    private notificationsService:NotificationsService
    
    ) { }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.settingsPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.settingsPager.currentPage);
      }
    })
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
    this.settingsPager.currentPage = page;
    this.settings$ = this.settingsService.list(this.settingsPager).pipe(
      tap((res: any) => { this.settingsPager = {...this.settingsPager, ...res.meta, inited:true} }),
      map((res:any) => res.data)
    );
  }

  trackById(index, item ) {
    return item.id;
  }

  filterChanged(filters){
    console.log(filters);
  }
  changeOption(setting,newValue){
    const newSetting = { ...setting, value:newValue}
    this.settingsService.update(setting.id,newSetting).subscribe((res)=>{
      this.notificationsService.showSuccess('success.settings_saved');

    },(err)=>{
      this.notificationsService.showError('error.settings.not_saved');
      this.pageChanged();
    });
  }
}
