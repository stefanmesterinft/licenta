import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionsService, NotificationsService } from '@services/index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ANSWERTYPE, ANSWER_LABELS } from '@constants/answer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  selected: any = {};
  questions$;
  parentQuestion;
  ANSWERTYPE = ANSWERTYPE;
  answerTypes = ANSWER_LABELS;
  submitted: Boolean = false;

  form = new FormGroup({
    description: new FormControl('', [Validators.required]),
    question: new FormControl('', [Validators.required]),
    answerType: new FormControl('', [Validators.required]),
    parent: new FormControl(undefined),
    answers: new FormControl(undefined),
    parentAnswersRequired: new FormControl(undefined)
  })
  constructor(private modalref: BsModalRef,
    private questionsService: QuestionsService,
    private notificationsService: NotificationsService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getTypeaheadData()
  }

  getTypeaheadData() {
    this.questions$ = typeaheadDefaultObservable(
      this.selected, 'parentModel',
      this.questionsService, 'listTypeahead',
    )
  }

  selectMatch(event) {
    this.form.patchValue({ parent: event.item.id })
  }

  dismiss() {
    this.modalref.hide()
  }

  get f() { return this.form.controls }


  clearTypeahead() {
    this.form.controls.parent.reset();
    this.selected = {};
  }

  submit() {
    this.submitted = true

    if (this.form.invalid) {
      return
    }

    const data = { ...this.form.value }

    if(data.answers){
      data.answers = data.answers.split(/\r?\n/);
    }else{
      data.answers = null;
    }

    if(data.parentAnswersRequired){
      data.parentAnswersRequired = data.parentAnswersRequired.split(/\r?\n/);
    }else{
      data.parentAnswersRequired = null;
    }
    
    this.questionsService.create(data).subscribe((resp: any) => {
      this.notificationsService.showSuccess('success.question_has_been_added');
      this.modalService.setDismissReason('success');
      this.dismiss()
    }, (res) => {
      if (res.error && res.error.message) {
        this.notificationsService.showError(res.error.message);
      } else {
        this.notificationsService.showError('error.something_went_wrong');
      }
    });
  }
}
