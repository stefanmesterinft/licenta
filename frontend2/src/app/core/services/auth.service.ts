import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { RoutesService } from './routes.service';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { of, Subject } from 'rxjs';
import { serialize } from 'object-to-formdata';

@Injectable()
export class AuthService {
  profileChanged = new Subject<boolean>();
  prefix = '/auth';

  constructor(
    public httpClient: HttpClient, 
    private router: Router, 
    private storageService: StorageService,
    private routesService: RoutesService
    ) {}


  public login(data){
    return this.httpClient.post(`${this.prefix}/login`,data).pipe(
      map((response:any)=>{

        this.storageService.setToken(response.token.accessToken);
        this.updateLocalProfile(response.user);

        if(this.isAuthenticated()){
          const dashboard = this.dashboardPath();

          if( !dashboard ){
            this.logout();
            return;
          }

          this.router.navigate([dashboard]);
        }

      })
    );
  }

 
  public register(userData){
    const formData = serialize(userData, {nullsAsUndefineds: true})

    return this.httpClient.post(`${this.prefix}/register`,formData)
  }

  public registerFromAccount(userData){
    const formData = serialize(userData, {nullsAsUndefineds: true})

    return this.httpClient.post(`${this.prefix}/registerFromAccount`,formData)
  }

  public forgotPassword(email){
    return this.httpClient.get(`${this.prefix}/forgot-password/${email}`)
  }

  public resendVerification(email){
    return this.httpClient.get(`${this.prefix}/email/resend-verification/${email}`)
  }

  public resetPassword(data){
    return this.httpClient.post(`${this.prefix}/reset-password`, data)
  }

  public verifyEmail(token){
    return this.httpClient.get(`${this.prefix}/email/verify/${token}`)
  }

  public isAuthenticated(): boolean {
    const token = this.storageService.getToken();
    // Check whether the token is expired and return
    // true or false
    return !!token;
  }

  public getRoles(){
    const user = this.user();
    return user.roles || [];
  }

  public getId(){
    const user = this.user();
    return user.id || null;
  }

  public getCustomerId(){
    const user = this.user();
    return user.customer?.id || null;
  }

  public user(){
    const user = this.storageService.getObject('user') || {};
    return user;
  }

  public hasRole(...expectedroles:string[]){
    if(!expectedroles){
      return true;
    }
    
    const userroles = this.getRoles();
    const result = expectedroles.some((role:string)=>{
      return userroles.includes(role);
    });
    return result
  }

  public profile(){
    return this.httpClient.get(`${this.prefix}/me`).pipe(
      map((profile) => {
        this.updateLocalProfile(profile);
        return profile;
      })
    );
  }

  public updateLocalProfile(profile){
      this.storageService.setObject('user', profile);
      this.profileChanged.next(true);
  }

  public dashboard(): any{
    return this.routesService.dashboardByRole(...this.getRoles());
  }

  public dashboardPath(){
    const dashboard = this.dashboard();
    return dashboard ? dashboard.path : '';
  }

  public logout(){
    this.storageService.clearAll();
    this.profileChanged.next(true);
    this.router.navigate(['/auth/login']);
  }


  public sendSMS(phoneNumber){
    return this.httpClient.get(`${this.prefix}/phone/send/${phoneNumber}`);
  }
  public sendSMSViaEmail(email){
    return this.httpClient.get(`${this.prefix}/phone/send/?email = ${email}`);
  }
  public verifySMS(code,phone){
    return this.httpClient.get(`${this.prefix}/phone/verify/${phone}/${code}`);
  }

}