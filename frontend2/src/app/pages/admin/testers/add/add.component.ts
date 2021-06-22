import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService, AuthService, CustomersService } from '@services/index';
import { PasswordsMatch, TesterRoleValidator } from '@validators/validators';
import { ROLE } from '@constants/roles';
import { Observable, Observer } from 'rxjs';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
import { SEX_LABELS } from '@constants/sex';
import { RACE_LABELS } from '@constants/races';
import { STATES_LABELS } from '@constants/states';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddTesterComponent implements OnInit {


  submitted = false;
  selected: any = {};
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
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    customer: new FormControl('', [Validators.required]),
    race_ethnicity: new FormControl('',[Validators.required]),
    sex: new FormControl('',[Validators.required]),
    emailConfirmed: new FormControl(false),
    
    tester: new FormControl(true),
    monitor: new FormControl(false),
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
    this.getTypeaheadData()
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

  submit() {
    this.submitted = true

    if (this.form.invalid) {
      return
    }
    const data = { ...this.form.value, roles: [] }
    if (data.tester) {
      data.roles.push(ROLE.TESTER);
    }
    if (data.monitor) {
      data.roles.push(ROLE.TESTER_MONITOR);
    }
    this.usersService.create(data).subscribe((resp: any) => {
      this.notificationsService.showSuccess("success.account_has_been_created");
      this.modalService.setDismissReason('success');
      this.dismiss()
    }, (res) => {
      if (res.error && res.error.message) {
        this.notificationsService.showError(res.error.message);
      } else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    });
  }
}
