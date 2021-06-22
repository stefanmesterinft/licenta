import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductService, AuthService, CustomersService, FileService } from '@services/index';
import { PasswordsMatch } from '@validators/passwords-match.validator';
import { ROLE } from '@constants/roles';
import { Observable, Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { CUSTOMERTYPE } from '@constants/customer-type';
import { typeaheadDefaultObservable } from '@utils/utils';
import { NotificationsService } from '@services/notifications.service';
import { SEX_LABELS } from '@constants/sex';
import { RACE_LABELS } from '@constants/races';
import { STATES_LABELS } from '@constants/states';
import { SIZE_LABELS } from '@constants/size-type';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  submitted=false;
  selected:any = {};
  clients$: Observable<any>;
  product: any;

  imgFile:string;
  size = SIZE_LABELS;
  productFile = new FormData();

  form:FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    brand: new FormControl('',[Validators.required]),
    price: new FormControl('',[Validators.required]),
    size: new FormControl('',[Validators.required]),
    stock: new FormControl('',[Validators.required]),
    new_price: new FormControl('',[]),
    sex: new FormControl('',[]),
    color: new FormControl('',[]),
    description: new FormControl('',[]),
    material: new FormControl('',[]),
    image: new FormControl('',[Validators.required]),
    code: new FormControl('',[Validators.required]),
  });

  constructor(private modalref:BsModalRef,
    private productsService:ProductService,
    private modalService:BsModalService,
    private customersService:CustomersService,
    private notificationsService: NotificationsService,
    private fileService: FileService
  ) { }

  ngOnInit() {
    if(this.product){
      this.form.patchValue({...this.product});
    }
    this.geTypeahedData();
  }

  geTypeahedData(){
    this.clients$ = typeaheadDefaultObservable(
      this.selected,'customerModel',
      this.customersService,'listTypeahead',
      {'filter[customer.type]': CUSTOMERTYPE.CLIENT}
    )
  }

  selectMatch(event){
    this.form.patchValue({customer: event.item.id});
  }

  dismiss(){
    this.modalref.hide()
  }

  uploadImage(field, event){
    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
      return
    }
    
    const file: File = event.target.files[0];
    const profile = new FormData();

    profile.append('file', file);
    profile.append('title', file.name);

    this.fileService.create(profile).subscribe(
      (resp: any) => {
        this.imgFile = resp.id;
        this.form.controls['image'].setValue(resp);
      },
      (res) => {
        if (res.error && res.error.message) {
          this.notificationsService.showError(
            res.error.message
          );
        } else {
          this.notificationsService.showError(
            'error.something_went_wrong'
          );
        }
      },
    );
  }
  get f(){ return this.form.controls}

  async submit(){
    this.submitted = true

    if (this.form.invalid || !this.product.id) {
      return
    }
    const data = {...this.form.value};
    
    this.productsService.update(this.product.id,data).subscribe((resp:any)=>{
        this.notificationsService.showSuccess('success.account_has_been_edited');
        this.modalService.setDismissReason('success');
        this.dismiss()

    }, (res) => {
      if(res.error && res.error.message){
        this.notificationsService.showError(res.error.message);
      }else {
        this.notificationsService.showError('error.something_went_wrong');
      }
    });
  }

}
