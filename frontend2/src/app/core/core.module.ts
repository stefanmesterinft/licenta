import { CommonModule } from '@angular/common';
import {
    HTTP_INTERCEPTORS,
    HttpClientModule
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardService, RoleGuardService } from './guards';
import { TokenInterceptor, ErrorInterceptor } from './interceptors';
import { UsersService } from './services/users.service';
import { RoutesService } from './services/routes.service';
import { LayoutService } from './services/layout.service';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { TestsService } from './services/tests.service';
import { DevicesService } from './services/devices.service';
import { JobsService } from './services/jobs.service';
import { CustomersService } from './services/customers.service';
import { SamplesService } from './services/samples.service';
import { CartService, FileService, MessagesService, NotificationsService, OrderService, ProductService, SettingsService } from './services';
import { OneSignalService } from './services/onesignal.service';
import { QuestionsService } from '@services/questions.service';

const providers = [
    // services
    AuthService,
    FileService,
    StorageService,
    DevicesService,
    TestsService,
    UsersService,
    JobsService,
    CustomersService,
    SamplesService,
    QuestionsService,
    MessagesService,
    SettingsService,
    ProductService,
    CartService,
    OrderService,
    // General
    LayoutService,
    RoutesService,
    NotificationsService,
    OneSignalService,


    // guards
    RoleGuardService,
    AuthGuardService,

    // interceptors
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi: true
    }
]

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule
    ],
    providers: providers
})
export class CoreModule {
    static forRoot() {
        return {
            ngModule: CoreModule,
            providers: providers,
        };
    }
}