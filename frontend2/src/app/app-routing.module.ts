import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuardService, RoleGuardService } from './core/guards';
import { Page404Component } from './pages/common/page404/page404.component';
import { ROLE } from './core/constants/roles';
import { AuthLayoutModule } from './layouts/auth-layout/auth-layout.module';


import { AdminDashboardModule } from './pages/admin/dashboard/dashboard.module';
import { AdminHomepageModule } from './pages/admin/homepage/homepage.module';
import { AdminCompaniesModule } from './pages/admin/companies/companies.module';
import { AdminTestsModule }     from './pages/admin/tests/tests.module';
import { AdminPaymentsModule }  from './pages/admin/payments/payments.module';
import { AdminJobsModule }      from './pages/admin/jobs/jobs.module';
import { AdminProfileModule }   from './pages/admin/profile/profile.module';
import { AdminClientsModule }   from './pages/admin/clients/clients.module';
import { AdminTestersModule }   from './pages/admin/testers/testers.module';
import { AdminPatientsModule }  from './pages/admin/patients/patients.module';
import { AdminQuestionsModule } from './pages/admin/questions/questions.module';
import { AdminSettingsModule }  from './pages/admin/settings/settings.module';
import { AdminCreateProductModule }  from './pages/admin/createProduct/createProduct.module';
import { AdminCartModule }  from './pages/admin/cart/cart.module';



import { TesterDashboardModule }   from './pages/tester/dashboard/dashboard.module';
import { TesterTestsModule }       from './pages/tester/tests/tests.module';
import { TesterTestersModule }     from './pages/tester/testers/testers.module';
import { TesterDevicesModule }     from './pages/tester/devices/devices.module';
import { TesterProfileModule }     from './pages/tester/profile/profile.module';
import { TesterJobsModule }        from './pages/tester/jobs/jobs.module';
import { TesterSchedulerModule }   from './pages/tester/scheduler/scheduler.module';

import { ClientDashboardModule } from './pages/client/dashboard/dashboard.module';
import { ClientSchedulerModule } from './pages/client/scheduler/scheduler.module';
import { ClientReportModule }    from './pages/client/report/report.module';
import { ClientProfileModule }   from './pages/client/profile/profile.module';
import { ClientTestsModule }     from './pages/client/tests/tests.module';

import { UserProfileModule }   from './pages/user/profile/profile.module';
import { UserHomepageModule } from './pages/user/homepage/homepage.module';
import { UserCartModule } from './pages/user/cart/cart.module';
import { UserMyOrdersModule } from './pages/user/my-orders/orders.module';



import { DashboardLayoutComponent }    from './layouts/dashboard-layout/dashboard-layout.component';
import { ClientJobsModule }            from './pages/client/jobs/jobs.module';
import { PublicLayoutComponent }       from './layouts/public-layout/public-layout.component';
import { TermsComponent }              from './pages/common/terms/terms.component';
import { PrivacyComponent }            from './pages/common/privacy/privacy.component';
import { ContactComponent }            from './pages/common/contact/contact.component';
import { AdminSamplesModule }          from './pages/admin/samples/samples.module';
import { TesterSamplesModule }         from './pages/tester/samples/samples.module';
import { UserSchedulerModule }         from './pages/user/scheduler/scheduler.module';
import { CommonCustomerProfileModule } from './pages/common/customer-profile/customer-profile.module';
import { AdminUsersModule }            from './pages/admin/users/users.module';
import { AdminOrdersModule }            from './pages/admin/orders/orders.module';
import { AdminMyOrdersModule }            from './pages/admin/my-orders/orders.module';
import { AdminProductsModule }            from './pages/admin/view-products/view-products.module';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'page',
    component: PublicLayoutComponent,
    children: [
     {
      path: 'terms',
      component: TermsComponent,
      data: {
        title: 'footer.terms_and_cond',
      }
     },
     {
      path: 'privacy',
      component: PrivacyComponent,
      data: {
        title: 'footer.privacy',
      }
     },
     {
      path: 'contact',
      component: ContactComponent,
      data: {
        title: 'footer.contact',
      }
     }
    ]
  },
  {
    path: '404',
    component: Page404Component
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        loadChildren: () => AuthLayoutModule
      }
    ]
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: {
      roles: [ROLE.ADMIN],
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => AdminDashboardModule,
        data: {
          title: 'Dashboard',
          dashboard: true,
        },
      },
      {
        path: 'homepage',
        loadChildren: () => AdminHomepageModule,
        data: {
          title: 'Dashboard',
          dashboard: true,
        },
      },
      {
        path: 'orders',
        loadChildren: () => AdminOrdersModule,
        data: {
          title: 'Orders',
          dashboard: true,
        },
      },
      {
        path: 'my-orders',
        loadChildren: () => AdminMyOrdersModule,
        data: {
          title: 'Orders',
          dashboard: true,
        },
      },
      {
        path: 'create-products',
        loadChildren: () => AdminCreateProductModule,
        data: {
          title: 'Create Product',
        }
      },
      {
        path: 'view-products',
        loadChildren: () => AdminProductsModule,
        data: {
          title: 'Create Product',
        }
      },
      {
        path: 'samples',
        loadChildren: () => AdminSamplesModule,
        data: {
          title: 'Samples',
        }
      },
      {
        path: 'cart',
        loadChildren: () => AdminCartModule,
        data: {
          title: 'Cart',
        }
      },
      {
        path: 'clients',
        loadChildren: () => AdminClientsModule,
        data: {
          title: 'Clients'
        }
      },
      {
        path: 'companies',
        loadChildren: () => AdminCompaniesModule,
        data: {
          title: 'Testing Companies'
        }
      },
      {
        path: 'testers',
        loadChildren: () => AdminTestersModule,
        data: {
          title: 'Testers'
        }
      },
      {
        path: 'patients',
        loadChildren: () => AdminPatientsModule,
        data: {
          title: 'Patients'
        }
      },
      {
        path: 'users',
        loadChildren: () => AdminUsersModule,
        data: {
          title: 'Users'
        }
      },
      {
        path: 'tests',
        loadChildren: () => AdminTestsModule,
        data: {
          title: 'Tests',
        }
      },
      {
        path: 'payments',
        loadChildren: () => AdminPaymentsModule,
        data: {
          title: 'Payments',
        }
      },
      {
        path: 'profile',
        loadChildren: () => AdminProfileModule,
        data: {
          title: 'Profile',
          breadcrumbInverted: true
        }
      },
      {
        path: 'jobs',
        loadChildren: () => AdminJobsModule,
        data: {
          title: 'Jobs',
        }
      },
      {
        path: 'questions',
        loadChildren: () => AdminQuestionsModule,
        data: {
          title: 'Questions',
        }
      },
      {
        path: 'settings',
        loadChildren: () => AdminSettingsModule,
        data: {
          title: 'Settings',
        }
      },
    ]
  },
  {
    path: 'tester',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: {
      roles: [ROLE.TESTER, ROLE.TESTER_ADMIN, ROLE.TESTER_MONITOR]
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => TesterDashboardModule,
        data: {
          dashboard: true,
          title: 'Dashboard'
        }
      },
      {
        path: 'tests',
        loadChildren: () => TesterTestsModule,
        data: {
          title: 'Tests'
        }
      },
      {
        path: 'devices',
        loadChildren: () => TesterDevicesModule,
        data: {
          title: 'Devices'
        }
      },
      {
        path: 'samples',
        loadChildren: () => TesterSamplesModule,
        data: {
          title: 'Samples'
        }
      },
      {
        path: 'testers',
        loadChildren: () => TesterTestersModule,
        data: {
          title: 'Testers'
        }
      },
      {
        path: 'profile',
        loadChildren: () => TesterProfileModule,
        data: {
          title: 'Profile',
          breadcrumbInverted: true
        }
      },
      {
        path: 'jobs',
        loadChildren: () => TesterJobsModule,
        data: {
          title: 'Jobs',
        }
      },
      {
        path: 'schedule',
        loadChildren: () => TesterSchedulerModule,
        data: {
          title: 'Schedule'
        }
      },
      {
          path: 'clients/profile',
          loadChildren: () => CommonCustomerProfileModule,
          data: {
            title: 'Client profile',
            breadcrumbInverted: true
          }
      },
      {
          path: 'customers/profile',
          loadChildren: () => CommonCustomerProfileModule,
          data: {
            title: 'Organization profile',
            breadcrumbInverted: true
          }
      }
    ]
  },
  {
    path: 'client',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: {
      roles: [ROLE.CLIENT]
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => ClientDashboardModule,
        data: {
          dashboard: true,
          title: "Dashboard"
        },
      },
      {
        path: 'reports',
        loadChildren: () => ClientReportModule,
        data: {
          title: 'Reports'
        }
      },
      {
        path: 'tests',
        loadChildren: () => ClientTestsModule,
        data: {
          title: 'Tests'
        }
      },
      {
        path: 'schedule',
        loadChildren: () => ClientSchedulerModule,
        data: {
          title: 'Scheduler'
        }
      },
      {
        path: 'jobs',
        loadChildren: () => ClientJobsModule,
        data: {
          title: 'Jobs'
        }
      },      
      {
        path: 'profile',
        loadChildren: () => ClientProfileModule,
        data: {
          title: 'Profile',
          breadcrumbInverted: true
        }
      },
      {
          path: 'clients/profile',
          loadChildren: () => CommonCustomerProfileModule,
          data: {
            title: 'Organization profile',
            breadcrumbInverted: true
          }
      },
      {
          path: 'customers/profile',
          loadChildren: () => CommonCustomerProfileModule,
          data: {
            title: 'Testing company profile',
            breadcrumbInverted: true
          }
      }
    ]
  },
  {
    path: 'user',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: {
      roles: [ROLE.USER]
    },
    children: [
      {
        path: 'homepage',
        loadChildren: () => UserHomepageModule,
        data: {
          dashboard: true,
          title: 'Homepage'
        },
      },
      {
        path: 'cart',
        loadChildren: () => UserCartModule,
        data: {
          dashboard: true,
          title: 'Cart'
        },
      },
      {
        path: 'my-orders',
        loadChildren: () => UserMyOrdersModule,
        data: {
          dashboard: true,
          title: 'My Orders'
        },
      },
      {
        path: 'schedule',
        loadChildren: () => UserSchedulerModule,
        data: {
          dashboard: true,
          title: 'Scheduler'
        },
      },
      {
        path: 'profile',
        loadChildren: () => UserProfileModule,
        data: {
          title: 'Profile',
          breadcrumbInverted: true
        }
      },
      {
          path: 'clients/profile',
          loadChildren: () => CommonCustomerProfileModule,
          data: {
            title: 'Client profile',
            breadcrumbInverted: true
          }
      },
      {
          path: 'customers/profile',
          loadChildren: () => CommonCustomerProfileModule,
          data: {
            title: 'Testing company profile',
            breadcrumbInverted: true
          }
      }

    ]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
