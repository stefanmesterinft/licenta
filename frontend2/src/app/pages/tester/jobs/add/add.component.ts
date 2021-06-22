import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobsService, AuthService, CustomersService } from '@services/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ROLE } from '@constants/roles';
import { CUSTOMERSUBTYPE_LABELS } from '@constants/customer-subtype';
import { Observable } from 'rxjs';
import { typeaheadDefaultObservable } from '@utils/utils';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { NotificationsService } from '@services/notifications.service';
import { PasswordsMatch } from '@validators/validators';
import moment from 'moment';
import { STATES_LABELS } from '@constants/states';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

    // frontend flags
    submitted = false;
    addNewCustomer = false;

    // typeahead params
    selected: any = {}
    clients$: Observable<any>

    // constants
    ROLE = ROLE;
    subtypes = CUSTOMERSUBTYPE_LABELS;
    states = STATES_LABELS;
    maxBirthDate = new Date(Date.now() - 86400000);


    jobForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        estimatedTests: new FormControl(1, [Validators.required, Validators.min(1)]),
        rangeDate: new FormControl([new Date(), new Date()]),
        client: new FormControl('', [Validators.required])
    });
    constructor(
        private jobService: JobsService,
        private authService: AuthService,
        private modalService: BsModalService,
        public bsModalRef: BsModalRef,
        private customersService: CustomersService,
        private notificationsService: NotificationsService
    ) { }

    ngOnInit() {
        this.getTypeaheadData();
    }

    getTypeaheadData() {
        this.clients$ = typeaheadDefaultObservable(
            this.selected, 'clientModel',
            this.customersService, 'listTypeahead',
            {
                'filter[customer.type]': CUSTOMERTYPE.CLIENT,
                showAddNewOption: true,
                newOptionText: "Add a new client"
            }
        )
    }

    get f() { return this.jobForm.controls; }
    get userf() { return this.jobForm.get('userForm')['controls'] }

    dismiss() {
        this.bsModalRef.hide()
    }

    selectClient(event) {
        if (event && event.item) {
            if (event.item.id === '-1') {
                this.addNewCustomer = true;
                this.f.client.setValidators([]);
                this.jobForm.patchValue({ client: undefined });
                this.jobForm.addControl('userForm',
                    new FormGroup({
                        firstName: new FormControl('', [Validators.required]),
                        customerName: new FormControl('', [Validators.required]),
                        lastName: new FormControl('', [Validators.required]),
                        middleName: new FormControl(undefined),
                        email: new FormControl('', [Validators.required, Validators.email]),
                        dateOfBirth: new FormControl(undefined, [Validators.required]),
                        socialSecurityNumber: new FormControl(undefined),
                        address1: new FormControl('', [Validators.required]),
                        address2: new FormControl(undefined),
                        city: new FormControl('', [Validators.required]),
                        state: new FormControl('', [Validators.required]),
                        postalCode: new FormControl('', [Validators.required]),
                        password: new FormControl('', [Validators.minLength(8), Validators.required]),
                        confirmPassword: new FormControl('', [Validators.required]),
                        customerSubtype: new FormControl('', [Validators.required]),
                        phone: new FormControl('', [Validators.required, Validators.minLength(8)]),
                        customerEin: new FormControl(undefined, [Validators.required])
                    }, [PasswordsMatch])
                )
            } else {
                this.addNewCustomer = false;
                this.f.client.setValidators([Validators.required]);
                this.jobForm.removeControl('userForm');
                this.jobForm.patchValue({ client: event.item.id });
            }
        }

        this.f.client.updateValueAndValidity();
    }

    add() {
        this.submitted = true

        if (this.jobForm.invalid) {
            return;
        }

        if (this.addNewCustomer) {
            return this.createClientAndAddJob();
        }

        this.addJob();
    }

    createClientAndAddJob() {
        const userdata = {
            ...this.jobForm.controls.userForm.value,
            roles: [ROLE.CLIENT],
            password: '123456789'
        }

        userdata.dateOfBirth = userdata.dateOfBirth.toISOString();

        this.authService.registerFromAccount(userdata).subscribe((data: any) => {
            this.addJob(data.customer.id);
        }, (res) => {
            if (res.error && res.error.message) {
                this.notificationsService.showError(res.error.message);
            } else {
                this.notificationsService.showError("error.something_went_wrong");
            }
        })
    }

    addJob(clientid?: string) {
        const data = {
            ...this.jobForm.value,
            startDate: moment(this.jobForm.value.rangeDate[0]).startOf('day').utc().toISOString(),
            endDate: moment(this.jobForm.value.rangeDate[1]).endOf('day').utc().toISOString()
        }

        if (clientid) {
            data.client = clientid;
        }

        this.jobService.create(data).subscribe((resp: any) => {
            this.notificationsService.showSuccess("success.job_has_been_created");
            this.modalService.setDismissReason('success');
            this.dismiss();
        }, (res) => {
            if (res.error && res.error.message) {
                this.notificationsService.showError(res.error.message);
            } else {
                this.notificationsService.showError("error.something_went_wrong");
            }
        })
    }

}
