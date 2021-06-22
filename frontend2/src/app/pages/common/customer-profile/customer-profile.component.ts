import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '@services/users.service';
import { environment } from '@environments/environment';
import { NotificationsService } from '@services/notifications.service';
import { CustomersService } from '@services/customers.service';
import { CUSTOMERTYPE } from '../../../core/constants/customer-type';
import { ROLE } from '@constants/roles';
import { STATES_LABELS } from '@constants/states';


@Component({
  selector: 'app-customer-profile',
  templateUrl: 'customer-profile.component.html',
  styleUrls:['customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  id = this.route.snapshot.params['id1'];
  profile: any = {};
  editMode: Boolean = false;
  submitted: Boolean = false;
  testIntroduction='';

  maxBirthDate = new Date(Date.now() - 86400000);
  CUSTOMERTYPE = CUSTOMERTYPE;
  ROLE = ROLE;
  states = STATES_LABELS;
  


  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    ein: new FormControl('', [Validators.required]),
    clia: new FormControl(undefined),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    address1: new FormControl('', [Validators.required]),
    address2: new FormControl(undefined),
    postalCode: new FormControl('', [Validators.required])
  });
  members: any[] = [];
  dashboard: string = "";

  constructor(
    public authService: AuthService,
    private customersService: CustomersService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {
      this.id = this.route.snapshot.params['id'];
      this.dashboard = this.authService.dashboardPath();

      if(this.id){
        this.customersService.get(this.id).subscribe((profile:any) =>{
          this.setProfile(profile, true);
          this.testIntroduction=profile.test_introduction || '';
        })
      }else{
        this.authService.profile().subscribe((profile: any) =>{
          this.setProfile(profile.customer, true);
        })
      }
  }

  get f() { return this.profileForm.controls; }

  ngOnInit() {

  }

  setProfile(profile, reloadMembers?){
    this.profile = profile || {};
    this.profileForm.patchValue({...this.profile});

    if(reloadMembers){
      this.customersService.members(this.profile.id).subscribe((members:any) =>{
        this.members = members.data;
      })
    }
  }

  address(){
    return [
        this.profile.address1, this.profile.address2, 
        this.profile.city, this.profile.state, 
        this.profile.postalCode
    ].filter(Boolean).join(', ');
  }

  onSubmit() {
    this.submitted = true;

    console.log(this.profileForm);

    if(this.profileForm.invalid){
      return;
    }
    this.saveProfile(this.profileForm.value).then(profile=>{
      this.notificationsService.showSuccess("success.profile_has_been_saved");
      this.setProfile(profile);
      this.editMode = false;
      this.submitted = false;
    },err=>{
      if (err.error && err.error.message) {
        this.notificationsService.showError(err.error.message);
      } else {
        this.notificationsService.showError("error.something_went_wrong");
      }
    })
  }

  saveProfile(profile){
    return new Promise((succes,fail) =>{
      if(this.id){
        this.customersService.update(this.id, profile).subscribe((newprofile) => {
          if(newprofile){
            succes(newprofile);

          }
        }, (res) => {
          fail(res)

        });
      }else{
        this.customersService.update(this.profile.id, profile).subscribe((newprofile) => {
          if(newprofile){
            succes(newprofile);
            this.authService.profile().subscribe();
          }
        }, (res) => {
          fail(res);
        });
      }
    });
  }

  edit(){
    this.editMode = true;
  }

  uploadClick(fileUploadField){
    if(!this.editMode){
      return;
    }

    fileUploadField.click();
  }

  uploadImage(field, event){
    if(!this.editMode){
      return;
    }
    
    if (event.target.files.length == 0) {
      
      return
    }

    let file: File = event.target.files[0];
    const profile = new FormData();
    profile.append(field, file);

    this.saveProfile(profile);
  }
  
  cancel(){
    this.editMode = false;
    this.submitted = false;
    this.profileForm.patchValue({...this.profile});
  }


  saveIntroduction(){
    if(this.testIntroduction.length<=600){
      this.saveProfile({test_introduction:this.testIntroduction}).then((profile:any)=>{
        this.notificationsService.showSuccess('success.profile_has_been_saved');
        this.testIntroduction=profile.test_introduction;
      },err=>{
        this.notificationsService.showError('error.something_went_wrong');
      });
    }else{
      this.notificationsService.showError('error.pdf_introduction_to_long')
    }
  }

}
