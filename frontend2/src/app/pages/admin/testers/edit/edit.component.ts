import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordsMatch, TesterRoleValidator } from '@validators/validators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsersService, CustomersService } from '@services/index';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { ROLE } from '@constants/roles';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
import { SEX_LABELS } from '@constants/sex';
import { RACE_LABELS } from '@constants/races';
import { STATES_LABELS } from '@constants/states';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  tester: any;
  submitted = false;
  selected: any = {}
  customers$: Observable<any>;
  sex = SEX_LABELS;
  races = RACE_LABELS;
  states = STATES_LABELS;
  
  maxBirthDate = new Date(Date.now() - 86400000);
  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    middleName: new FormControl(undefined),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateOfBirth: new FormControl('', [Validators.required]),
    socialSecurityNumber: new FormControl(undefined),
    address1: new FormControl('', [Validators.required]),
    address2: new FormControl(undefined),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl(undefined, [Validators.minLength(8)]),
    confirmPassword: new FormControl(undefined),
    customer: new FormControl('', [Validators.required]),
    race_ethnicity: new FormControl('',[Validators.required]),
    sex: new FormControl('',[Validators.required]),

    tester: new FormControl(false),
    monitor: new FormControl(false),
    suspended: new FormControl(false)
  }, [
    PasswordsMatch,
    TesterRoleValidator
  ])

  constructor(private modalref: BsModalRef,
    private usersService: UsersService,
    private modalService: BsModalService,
    private customersService: CustomersService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.getTypeaheadData();
    if (this.tester) {
      this.form.patchValue(this.tester);
      if (this.tester.customer) {
        this.selected.customerModel = this.tester.customer.name;
        this.form.patchValue({ customer: this.tester.customer.id })
      }

      if (this.tester.dateOfBirth) {
        this.form.patchValue({ dateOfBirth: new Date(this.tester.dateOfBirth) });
      }

      if (this.tester.roles) {
        if (this.tester.roles.includes('TESTER')) {
          this.form.patchValue({ tester: true });
        }
        if (this.tester.roles.includes('TESTER_MONITOR')) {
          this.form.patchValue({ monitor: true });
        }
      }
      if(this.tester.hasOwnProperty('suspendedAt')){
        this.form.patchValue({suspended:true});
      }
    }

  }
  getTypeaheadData() {

    this.customers$ = typeaheadDefaultObservable(
      this.selected, 'customerModel',
      this.customersService, 'listTypeahead',
      { 'filter[customer.type]': CUSTOMERTYPE.TESTER }
    )
  }

  selectMatch(event) {
    this.form.patchValue({ customer: event.item.id });
  }
  dismiss() {
    this.modalref.hide()
  }

  get f() { return this.form.controls }

  async submit() {
    this.submitted = true

    if (this.form.invalid || !this.tester.id) {
      return
    }
    const data = { ...this.form.value, roles: [] }
    if (data.tester) {
      data.roles.push(ROLE.TESTER);
    }
    if (data.monitor) {
      data.roles.push(ROLE.TESTER_MONITOR);
    }
    if(data.suspended !== this.tester.hasOwnProperty('suspendedAt')){
      await this.usersService.suspend(this.tester.id, data.suspend).toPromise()
    }
    this.usersService.update(this.tester.id, data).subscribe((resp: any) => {
      this.notificationsService.showSuccess('success.account_has_been_edited');
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
