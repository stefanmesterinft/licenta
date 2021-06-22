import { Routes } from '@angular/router';
import { TestersComponent } from './testers.component';


export const TesterRoutes: Routes = [
    {
        path: '',
        component: TestersComponent,
    },
    {
        path: 'test',
        component: TestersComponent,
    },
];
