import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { DepartmentListComponent } from './vitalsign-list/vitalsign-list.component';

export const VITALSIGN_ROUTE: Route[] = [
  {
    path: 'vitalsign-list',
    component: DepartmentListComponent,
  },
  { path: '**', component: Page404Component },
];

