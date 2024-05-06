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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import {AuthService} from "@core";

import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {formatDate, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
export interface DialogData {
  id : number ;
  action: string;
  prescription: Prescription;
  patient_id : number ;
}


// @ts-ignore
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
        NgMultiSelectDropDownModule,

    ],
})
export class FormDialogComponent implements OnInit{
  action: string;
  dialogTitle: string;
  prescriptionForm: FormGroup = new FormGroup({});
  prescription: Prescription;
  date = new Date();
  id_patient! : number;
    dropdownList:any = [];
    selectedItems:any = [];
    dropdownSettings:any = {};

    options = [
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' },
        { value: '3', label: 'Three' },
        { value: '4', label: 'Four' },
        { value: '5', label: 'Five' },
        { value: '6', label: 'Six' },
        { value: '7', label: 'Seven' },
        { value: '8', label: 'Eight' },
        { value: '9', label: 'Nine' },
        { value: '10', label: 'Ten' }
    ];

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

      this.dropdownList = [

          { item_id: 'fever', item_text: 'fever' },
          { item_id: 'fatigue', item_text: 'fatigue' },
          { item_id: 'cough', item_text: 'cough' },
          { item_id: 'weightloss', item_text: 'weightloss' },
          { item_id: 'stomach ache', item_text: 'stomach ache' },
          { item_id: 'headache' , item_text: 'headache' },
          { item_id: 'chest pain' , item_text: 'chest pain' },


      ];
      this.selectedItems = [

      ];
      this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: true
      };
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

        // Get the selected symptoms from the ng-multiselect-dropdown component
        const selectedSymptoms = this.selectedItems.map((item: any) => item.item_text);

        // Join the selected symptoms into a single string separated by commas
        const symptomsString = selectedSymptoms.join(', ');
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
                symptoms: symptomsString,
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

