import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { QuestionsService, NotificationsService } from '@services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddComponent } from './add/add.component';
import swal from 'sweetalert2';
import { tap, map } from 'rxjs/operators';
import { LayoutService } from '@services/layout.service';
import { Observable } from 'rxjs';
import { EditComponent } from './edit/edit.component';
import { ModalDefaultOptions, typeaheadDefaultObservable } from '@utils/utils';
import { ANSWER_LABELS } from '@constants/answer-type';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements  OnInit, OnDestroy, AfterViewInit {

  @ViewChild('filtersForm') filtersForm;
  answerTypes = ANSWER_LABELS;
  
  selected:any={}
  parents$:Observable<any>
  filters: any = {};
  questions$: Observable<any>;
  questionsPager: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    inited:false
  };
  searchSubscription: any;

  constructor(private questionsService: QuestionsService,
    private modalService: BsModalService,
    private layoutService: LayoutService,
    private notificationsService:NotificationsService) { }

  ngOnInit() {
    this.pageChanged();
    this.searchSubscription = this.layoutService.searchGetText().subscribe(text => {
      this.questionsPager.q = text;
      this.pageChanged();
    });
    this.modalService.onHidden.subscribe((shouldReload)=>{
      if(shouldReload === 'success'){
        this.pageChanged(this.questionsPager.currentPage);
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
    this.questionsPager.currentPage = page;
    this.questions$ = this.questionsService.list(this.questionsPager).pipe(
      tap((res: any) => { this.questionsPager = {...this.questionsPager, ...res.meta, inited: true } }),
      map(res => res.data)
    );
  }

  getTypeaheadData(){
    this.parents$ = typeaheadDefaultObservable(
      this.selected, 'parent',
      this.questionsService, 'listTypeahead');
  }


  clearIfEmpty(field){
    const value = this.selected[field];

    if((value === undefined || value === '') && this.filters[field]){
      delete this.filters[field];
      this.filterChanged(this.filters, true);
    }
  }

  selectMatch(name,event){
    this.filters[name] = event.item?.id || event.target?.value
    this.filterChanged(this.filters);
  }

  filterChanged(filters, forceReload?) {
    this.questionsPager.filter = {};

    if(filters.answerType){
      this.questionsPager.filter['question.answerType'] = filters.answerType;
    }

    if(filters.parent){
      this.questionsPager.filter['question.parent_id'] = filters.parent;
    }

    if(Object.keys(filters).length && this.questionsPager.inited || forceReload){
      this.pageChanged();
    }
  }

  add() {
    this.modalService.show(AddComponent,ModalDefaultOptions({}));
  }

  edit(question){
    this.modalService.show(EditComponent, ModalDefaultOptions({
      data: {question}
    }))
  }

  delete(question) {
    swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete this question?',
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
        this.questionsService.delete(question.id).subscribe((resp)=>{
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
