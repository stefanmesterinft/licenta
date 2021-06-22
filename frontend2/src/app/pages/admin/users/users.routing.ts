import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';


export const UserRoutes: Routes = [
    {
        path: '',
        component: UsersComponent,
    },
    {
        path: 'test',
        component: UsersComponent,
    },
];
