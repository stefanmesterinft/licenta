import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '@services/users.service';
import { environment } from '@environments/environment';
import { NotificationsService } from '@services/notifications.service';
import { SEX_LABELS } from '@constants/sex';
import { RACE_LABELS } from '@constants/races';
import { STATES_LABELS } from '@constants/states';
import * as moment from 'moment';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  id = this.route.snapshot.params['id1'];

  sex = SEX_LABELS;
  races = RACE_LABELS;
  states = STATES_LABELS;

  profile: any = {};
  editMode: Boolean = false;
  submitted: Boolean = false;
  maxBirthDate = new Date(Date.now() - 86400000);
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    middleName: new FormControl(undefined, []),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    address1: new FormControl('', [Validators.required]),
    address2: new FormControl(undefined, []),
    socialSecurityNumber: new FormControl(undefined, []),
    postalCode: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    about: new FormControl(undefined, []),
    age: new FormControl(undefined, []),
    race_ethnicity: new FormControl('',[Validators.required]),
    sex: new FormControl('',[Validators.required])
  });

  constructor(
    public authService: AuthService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {
      this.id = this.route.snapshot.params['id'];

      if(this.id){
        this.userService.get(this.id).subscribe((profile) =>{
          this.setProfile(profile);
        })
      }else{
        this.authService.profile().subscribe((profile) =>{
          this.setProfile(profile);
        })
      }
  }

  get f() { return this.profileForm.controls; }

  ngOnInit() {

  }

  setProfile(profile){
    this.profile = profile || {};
    this.profileForm.patchValue({...this.profile});
    if(this.profile.dateOfBirth){
      this.profileForm.patchValue({ dateOfBirth: moment.utc(this.profile.dateOfBirth).toDate() });
    }
  }

  formatSex(value){
    const result = this.sex.find(elem=>elem.value === value);
    return result ? result.label : '';
  }
  formatRace(value){
    const result = this.races.find(elem=>elem.value === value);
    return result ? result.label : '';
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

    if(this.profileForm.invalid){
      return;
    }

    this.saveProfile(this.profileForm.value);
  }

  saveProfile(profile){
    if(this.id){
      this.userService.update(this.id, profile).subscribe((newProfile) => {
        if(newProfile){
          this.notificationsService.showSuccess('success.profile_has_been_saved');
          this.setProfile(newProfile);
          this.editMode = false;
          this.submitted = false;
        }
      }, (res) => {
        if (res.error && res.error.message) {
          this.notificationsService.showError(res.error.message);
        } else {
          this.notificationsService.showError('error.something_went_wrong');
        }
      });
    }else{
      this.userService.updateProfile(profile).subscribe((newProfile) => {
        if(newProfile){
          this.notificationsService.showSuccess('success.profile_has_been_saved');
          this.setProfile(newProfile);
          this.editMode = false;
          this.submitted = false;
          this.authService.profile().subscribe();
        }
      }, (res) => {
        if (res.error && res.error.message) {
          this.notificationsService.showError(res.error.message);
        } else {
          this.notificationsService.showError('error.something_went_wrong');
        }
      });
    }
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

    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {

      return
    }

    const file: File = event.target.files[0];
    const profile = new FormData();
    profile.append(field, file);

    this.saveProfile(profile);
  }
  
  cancel(){
    this.editMode = false;
    this.submitted = false;
    this.profileForm.patchValue({...this.profile});
  }
}
