import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import { PrescriptionService } from '../../prescriptions.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { Prescription } from '../../../../doctor/prescription/prescription.model';

import {AuthService} from "@core";

import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {formatDate, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";

export interface DialogData {
  id : number ;
  action: string;
  prescription: Prescription;
  patient_id : number ;
}


@Component({
  selector: 'app-form-dialog:not(h)',
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
    MatDatepickerModule,
    MatDialogClose,
    NgIf,
  ],
})
export class FormDialogComponent implements OnInit{
  action: string;
  dialogTitle: string;
  prescriptionForm: FormGroup = new FormGroup({});
  prescription: Prescription;
  date = new Date();
  id_patient! : number;

  constructor(
      public dialogRef: MatDialogRef<FormDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private formBuilder: UntypedFormBuilder,
      private prescriptionService: PrescriptionService,
      private AuthService :AuthService
  ) {

    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.prescription.title;
      this.prescription = data.prescription;
    } else {
      this.dialogTitle = 'New Prescription';
      const objetVide = {} as Prescription;
      this.prescription = new Prescription(objetVide);

    }
    this.prescriptionForm = this.createPrescriptionForm();
  }
  ngOnInit() {
      this.id_patient =this.AuthService.currentUserValue.id;
      this.prescriptionForm = this.formBuilder.group({
          id: [this.prescription.id],
          title: [this.prescription.title],
          diseases: [this.prescription.diseases],
          prescPhoto: [this.prescription.prescPhoto],
          createdDate: [
              formatDate(this.prescription.createdDate, 'yyyy-MM-dd', 'en'),

          ],
          emailPatient: [this.prescription.emailPatient],
          description: [this.prescription.description],
          medicines: this.formBuilder.array([], ),
          symptoms : this.prescription.symptoms,

      });

  }
  createPrescriptionForm(): FormGroup {
    return   this.prescriptionForm = this.formBuilder.group({
        id: [this.prescription.id],
        title: [this.prescription.title],
        diseases: [this.prescription.diseases],
        prescPhoto: [this.prescription.prescPhoto],
        createdDate: [
            formatDate(this.prescription.createdDate, 'yyyy-MM-dd', 'en'),

        ],
        emailPatient: [this.prescription.emailPatient],
        description: [this.prescription.description],
        medicines: this.formBuilder.array([], ),
symptoms : this.prescription.symptoms,
    }); }
    submit() {
        if (this.prescriptionForm.valid) {
            const prescription: Prescription = {
                id: this.action === 'edit' ? this.data.prescription.id : 0,
                title: this.prescriptionForm.value.title,
                diseases: this.prescriptionForm.value.diseases,
                prescPhoto: this.prescriptionForm.value.prescPhoto,
                createdDate: this.prescriptionForm.value.createdDate,
                emailPatient: this.prescriptionForm.value.emailPatient,
                description: this.prescriptionForm.value.description,
                doctor_id: -1,
                medicines: [],
                approved: true,
                symptoms: this.prescriptionForm.value.symptoms,
                ppatient_id: this.id_patient,
                suggestedMedicines : "",
              doctor_name : ""
            };

            if (this.action === 'edit') {
                // Handle updating the prescription if needed
                // Uncomment and fill in the logic if required
                 this.prescriptionService.updateItemStockList(prescription).subscribe(() => {
                   this.dialogRef.close(1); // Close the dialog with a success flag
                 });
            } else {
                // Create a new prescription
                this.prescriptionService.generatePrescription(prescription).subscribe(
                    () => {
                        this.dialogRef.close(1); // Close the dialog with a success flag
                    },
                    (error) => {
                        console.error('Error generating prescription:', error);
                        // Handle error (e.g., display a message to the user)
                    }
                );
            }
        } else {
            this.markFormGroupTouched(this.prescriptionForm);
        }
    }


    markFormGroupTouched(formGroup: FormGroup | FormArray) {
        (Object as any).values(formGroup.controls).forEach((control: AbstractControl) => {
            control.markAsTouched();

            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            }
        });
    }
    addPrescription(formData: any): void {
    this.prescriptionService.addItemStockList(formData).subscribe(() => {
      this.dialogRef.close(true); // Notify parent component that the operation was successful
    });
  }

  updatePrescription(formData: any): void {
    this.prescriptionService.updateItemStockList(formData).subscribe(() => {
      this.dialogRef.close(true); // Notify parent component that the operation was successful
    });
  }
    onNoClick(): void {
        this.dialogRef.close();
    }
  onClose(): void {
    this.dialogRef.close(false); // Notify parent component that the operation was canceled
  }
 /**   confirmAdd(): void {
    this.prescription.patient_id = this.AuthService.currentUserValue.id;
    const { symptoms } = this.prescriptionForm.getRawValue() ;
    this.prescription.symptoms = symptoms ;
        this.prescriptionService.generatePrescription(this.prescription);
    }*/
}

