import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PatientService } from '../../patient.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Allergie, Gender, Patient} from '../../patient.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {NgIf} from "@angular/common";

export interface DialogData {
  id: number;
  action: string;
  patient: Patient;
}

@Component({
    selector: 'app-form-dialog:not(i)',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    NgIf,
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  patientForm: UntypedFormGroup;
  patient: Patient;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public patientService: PatientService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.patient.name;
      this.patient = data.patient;
    } else {
      this.dialogTitle = 'New Patient';
      const blankObject = {
        idPatient: 0, // or whatever default value you prefer for idPatient
        name: '',
        patientPassword: '',
        date: new Date(),
        address: '',
        bgroupe: '',
        gender: Gender.Male, // or Gender.Female, depending on default
        mobile: '',
        patientContactEmergencies: '',
        medicalHistory: '',
        patientAlergies: Allergie.PEANUTS, // or whatever default Allergie you prefer
        treatment: '',
        image: '',
        email:''

      } as Patient;
      this.patient = new Patient(
        blankObject.idPatient,
        blankObject.name,
        blankObject.patientPassword,
        blankObject.date,
        blankObject.address,
        blankObject.bgroupe,
        blankObject.gender,
        blankObject.mobile,
        blankObject.patientContactEmergencies,
        blankObject.medicalHistory,
        blankObject.patientAlergies,
        blankObject.treatment,
        blankObject.image ,
        blankObject.email

      );
    }
    this.patientForm = this.createContactForm();
    this.patientForm.get('address')?.valueChanges.subscribe((value: string) => {
      if (value.length > 20) {
        console.log('Address cannot exceed 20 characters');
      }
    });

  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  hidePassword: boolean = true;
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      idPatient: [this.patient.idPatient],
      img: [this.patient.image],
      name: [this.patient.name],
      email: [this.patient.email],
      gender: [this.patient.gender],
      date: [this.patient.date],
      bgroupe: [this.patient.bgroupe],
      mobile: [this.patient.mobile],
      address: [this.patient.address, Validators.maxLength(20)],
      patientPassword: [this.patient.patientPassword], // Add patientPassword attribute
      patientContactEmergencies: [this.patient.patientContactEmergencies], // Add patientContactEmergencies attribute
      medicalHistory: [this.patient.medicalHistory], // Add medicalHistory attribute
      patientAlergies: [this.patient.patientAlergies], // Add patientAlergies attribute
      treatment: [this.patient.treatment],
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.patientService.addPatient(this.patientForm.getRawValue());
  }

  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   const file: File | null = fileInput?.files ? fileInput.files[0] : null;
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.patientForm.patchValue({
  //         image: reader.result,
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
}
