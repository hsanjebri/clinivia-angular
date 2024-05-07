import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {PatientService} from "../allpatients/patient.service";

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    FileUploadComponent,
    MatButtonModule,
  ],
})
export class AddPatientComponent {
  patientForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,private patientService: PatientService) {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required]],
      patientPassword: ['', [Validators.required]],
      date: ['', [Validators.required]],
      address: ['', [Validators.required]],
      bgroupe: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      patientContactEmergencies: ['', [Validators.required]],
      medicalHistory: ['', [Validators.required]],
      patientAlergies: ['', [Validators.required]],
      treatment: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      image: [''],
      password: ['', [Validators.required]],

    });
  }
  onSubmit() {
    console.log('Form Value', this.patientForm.value);
    this.patientService.addPatient(this.patientForm.getRawValue());

  }
}
