import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PrescriptionService } from '../../prescription.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl, FormArray
} from '@angular/forms';
import { Prescription } from '../../prescription.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {Patient} from "../../../../admin/patients/allpatients/patient.model";
import {PatientService} from "../../../../admin/patients/allpatients/patient.service";
import {MatTooltip} from "@angular/material/tooltip";
import {MedicineListComponent} from "../../../../admin/pharmacy/medicine-list/medicine-list.component";
import {MedicineList} from "../../../../admin/pharmacy/medicine-list/medicine-list.model";

export interface DialogData {
  id: number;
  action: string;
  itemStockList: Prescription;
}
export interface DialogDataMed {
  id: number;
  action: string;
  medicine: MedicineList;
}

function datevalidator(minimumAge: number) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentdate = control.value;

    const minimumDate = new Date();


    if (currentdate > minimumDate) {
      return { minimumAge: true };
    }
    return null;
  };
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
    FileUploadComponent,
    MatTooltip,
    MedicineListComponent
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  itemStockListForm: UntypedFormGroup;
  itemStockList: Prescription;
  medComponent!: MedicineListComponent;
  ListMed!: MedicineList[];
  minDate = new Date(); // Today's date for minimum date selection
  medicine : MedicineList;
  medicineForm : UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject(MAT_DIALOG_DATA) public dataMed: DialogDataMed,

    public itemStockListService: PrescriptionService,
    private fb: UntypedFormBuilder,

) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.itemStockList.title;
      this.itemStockList = data.itemStockList;
      this.medicine = dataMed.medicine;
    } else {
      this.dialogTitle = 'New prescription';
      const blankObject = {} as Prescription;
      this.itemStockList = new Prescription(blankObject);

      const blankObjectMed = {} as MedicineList;
      this.medicine = new MedicineList(blankObjectMed);
    }
    this.itemStockListForm = this.createContactForm();
    this.medicineForm = this.createMedicineForm() ;
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }
  createContactForm(): UntypedFormGroup {
    // @ts-ignore
    return this.fb.group({
        id: [this.itemStockList.id],
        title: [this.itemStockList.title, [Validators.required]],
        diseases: [this.itemStockList.diseases, [Validators.required]],
        prescPhoto: [this.itemStockList.prescPhoto],

      createdDate: [
            formatDate(this.itemStockList.createdDate, 'yyyy-MM-dd', 'en'),
            [Validators.required , datevalidator(0)],
        ],
      emailPatient: [this.itemStockList.emailPatient],
     // medForm: [this.itemStockList.Allmedicines.medForm],


    });
  }

  createMedicineForm(): UntypedFormGroup {
    // @ts-ignore
    return this.fb.group({
      id: [this.medicine.id],
      medForm: [this.medicine.medForm],
      m_name: [this.medicine.m_name],
      medDosage: [this.medicine.medDosage],
      medDescription: [this.medicine.medDescription],
      medPhoto: [this.medicine.medPhoto],

    });
  }



  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.itemStockListService.addItemStockList(
      this.itemStockListForm.getRawValue() );


  }


  public AddMedicine(): void {

        this.itemStockList.Allmedicines.push(this.createMedicineForm().getRawValue()) ;


  }


}
