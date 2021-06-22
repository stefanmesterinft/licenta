import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ANSWERTYPE, ANSWER_LABELS } from '@constants/answer-type';
import { NotificationsService, QuestionsService } from '@services/index';
import { typeaheadDefaultObservable } from '@utils/utils';
import { isArray } from 'lodash';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  question;
  questions$;
  selected: any = {};
  ANSWERTYPE = ANSWERTYPE;
  answerTypes = ANSWER_LABELS;
  submitted: Boolean = false;

  form = new FormGroup({
    description: new FormControl('', [Validators.required]),
    question: new FormControl('', [Validators.required]),
    answerType: new FormControl('', [Validators.required]),
    answers: new FormControl(undefined),
    parent: new FormControl(undefined),
    parentAnswersRequired: new FormControl(undefined)
  })
  constructor(private modalref: BsModalRef,
    private questionsService: QuestionsService,
    private notificationsService: NotificationsService,
    private modalService: BsModalService) { }

  ngOnInit() {
    if (this.question) {
      this.form.patchValue({
        description: this.question.description,
        question: this.question.question,
        answerType: this.question.answerType
      });

      if (this.question.parent) {
        this.selected.parentModel = this.question.parent.question;
        this.form.patchValue({
          parent: this.question.parent.id
        })
      }

      if (
        [ANSWERTYPE.RADIO, ANSWERTYPE.CHECKBOX, ANSWERTYPE.DROPDOWN]
          .includes(this.question.answerType) && this.question.answers
      ) {
        this.form.patchValue({
          answers: this.question.answers.join('\r\n')
        })
      }

      if (
        this.question.parentAnswersRequired && isArray(this.question.parentAnswersRequired)
      ) {
        this.form.patchValue({
          parentAnswersRequired: this.question.parentAnswersRequired.join('\r\n')
        })
      }
    }
    this.getTypeaheadData()
  }

  clearTypeahead() {
    this.form.controls.parent.reset();
    this.selected = {};
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

    this.questionsService.update(this.question.id, data).subscribe((resp: any) => {
      this.notificationsService.showSuccess('success.question_has_been_edited');
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
