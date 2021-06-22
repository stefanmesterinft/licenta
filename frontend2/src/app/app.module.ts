
import { Page404Component } from './pages/common/page404/page404.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TagInputModule } from 'ngx-chips';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './core/core.module';
import { AuthLayoutModule }   from './layouts/auth-layout/auth-layout.module';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { TermsComponent } from './pages/common/terms/terms.component';
import { PrivacyComponent } from './pages/common/privacy/privacy.component';
import { ContactComponent } from './pages/common/contact/contact.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { environment } from '@environments/environment';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// required for AOT compilation
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
        defaultLanguage: environment.fallback_language,
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    AppRoutingModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      timeOut: 5000,
      closeButton: true,
      enableHtml: true,
      tapToDismiss: true,
      autoDismiss: true,
      titleClass: 'alert-title',
      positionClass: 'toast-top-center',
      toastClass: 'ngx-toastr alert alert-dismissible alert-danger alert-notify',
    }),
    CollapseModule.forRoot(),
    TagInputModule,
    
    // custom modules
    CoreModule,
    AuthLayoutModule,
    NgbModule,
  ],
  declarations: [
    DashboardLayoutComponent,
    PublicLayoutComponent,
    TermsComponent,
    PrivacyComponent,
    ContactComponent,
    AppComponent,
    Page404Component,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }