import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { MealListComponent } from './bill-list/meal-list.component';
import { InvoiceComponent } from './invoice/invoice.component';

export const MEAL_ROUTE: Route[] = [
  {
    path: 'bill-list',
    component: MealListComponent,
  },
  {
    path: 'add-meal',
    component: AddMealComponent,
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
  },
  { path: '**', component: Page404Component },
];

