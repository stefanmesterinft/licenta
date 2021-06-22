import { Routes } from '@angular/router';
import { PatientsComponent } from './patients.component';


export const PatientRoutes: Routes = [
    {
        path: '',
        component: PatientsComponent,
    },
    {
        path: 'test',
        component: PatientsComponent,
    },
];
