import { Route } from '@angular/router';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.routes').then(
        (m) => m.DEPARTMENT_ROUTE
      ),
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./appointment/appointment.routes').then(
        (m) => m.APPOINTMENT_ROUTE
      ),
  },
  {
    path: 'doctors',
    loadChildren: () =>
      import('./doctors/doctors.routes').then((m) => m.DOCTOR_ROUTE),
  },
  {
    path: 'staff',
    loadChildren: () =>
      import('./staff/staff.routes').then((m) => m.STAFF_ROUTE),
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./patients/patients.routes').then((m) => m.PATIENT_ROUTE),
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('./billing/billing.routes').then((m) => m.BILLING_ROUTE),
  },
  {
    path: 'meal',
    loadChildren: () =>
      import('./meal/meal.routes').then((m) => m.MEAL_ROUTE),
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room.routes').then((m) => m.ROOMS_ROUTE),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.routes').then((m) => m.INVENTORY_ROUTE),
  },
  {
    path: 'records',
    loadChildren: () =>
      import('./records/records.routes').then((m) => m.RECORDS_ROUTE),
  },
  {
    path: 'ambulance',
    loadChildren: () =>
      import('./ambulance/ambulance.routes').then((m) => m.AMBULANCE_ROUTE),
  },
  {
    path: 'funerals',
    loadChildren: () =>
      import('./funerals/funerals.routes').then(
        (m) => m.FUNERALS_ROUTE
      ),
  },
  {
    path: 'vitalsigns',
    loadChildren: () =>
      import('./vitalsigns/vitalsigns.routes').then(
        (m) => m.VITALSIGN_ROUTE
      ),
  },
  {
    path: 'pharmacy',
    loadChildren: () =>
      import('./pharmacy/pharmacy.routes').then((m) => m.PHARMACY_ROUTE),
  },
  {
    path: 'subscription',
    loadChildren: () =>
      import('./subscription/subscription.routes').then((m) => m.SUBSCRIPTION_ROUTE),
  },
 

];
