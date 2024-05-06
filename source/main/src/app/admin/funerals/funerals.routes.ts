import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { DepartmentListComponent } from './funeral-list/funeral-list.component';

export const FUNERALS_ROUTE: Route[] = [
  {
    path: 'funeral-list',
    component: DepartmentListComponent,
  },
  { path: '**', component: Page404Component },
];

