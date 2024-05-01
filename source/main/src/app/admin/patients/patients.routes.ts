import { PatientProfileComponent } from "./patient-profile/patient-profile.component";
import { EditPatientComponent } from "./edit-patient/edit-patient.component";
import { AddPatientComponent } from "./add-patient/add-patient.component";
import { AllpatientsComponent } from "./allpatients/allpatients.component";
import { Page404Component } from "../../authentication/page404/page404.component";
import { Route } from "@angular/router";
import {NutritionComponent} from "./nutrition/nutrition.component";
import {ShowprogressComponent} from "./showprogress/showprogress.component";

export const PATIENT_ROUTE: Route[] = [
  {
    path: "all-patients",
    component: AllpatientsComponent,
  },
  {
    path: "add-patient",
    component: AddPatientComponent,
  },
  {
    path: "edit-patient",
    component: EditPatientComponent,
  },
  {
    path: "nutrition/:patientId",
    component: NutritionComponent,
  },
  {
    path: "showprogress/:patientId",
    component: ShowprogressComponent,
  },
  {
    path: "patient-profile",
    component: PatientProfileComponent,
  },
  { path: "**", component: Page404Component },
];

