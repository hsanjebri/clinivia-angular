import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MedicineListService } from '../../medicine-list.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicineList } from '../../medicine-list.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  medicineList: MedicineList;
}
@Component({
    selector: 'app-form-dialog:not(j)',
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
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatDialogClose,
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  medicineListForm: UntypedFormGroup;
  medicineList: MedicineList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public medicineListService: MedicineListService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.medicineList.mname;
      this.medicineList = data.medicineList;
    } else {
      this.dialogTitle = 'New MedicineList';
      const blankObject = {} as MedicineList;
      this.medicineList = new MedicineList(blankObject);
    }
    this.medicineListForm = this.createContactForm();
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
  /*createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.medicineList.id],
      mno: [this.medicineList.mno],
      mname: [this.medicineList.mname],
      category: [this.medicineList.category],
      company: [this.medicineList.company],
      pdate: [
        formatDate(this.medicineList.pdate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      pdate: [''],
      price: [this.medicineList.price],
      edate: [
        formatDate(this.medicineList.edate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      edate: [''],
      stock: [this.medicineList.stock],
    });
    if (this.medicineList.pdate) {
      formGroup.get('pdate')?.setValue(formatDate(this.medicineList.pdate, 'yyyy-MM-dd', 'en'));
    }
  
     Ajoutez le validateur requis pour la date si nécessaire
    formGroup.get('pdate')?.setValidators(Validators.required);
  
    return formGroup;
  }*/
  createContactForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      id: [this.medicineList.id],
      mno: [this.medicineList.mno],
      mname: [this.medicineList.mname],
      category: [this.medicineList.category],
      company: [this.medicineList.company],
      pdate: [''], // Initialiser avec une chaîne vide pour éviter les erreurs si la date est undefined
      price: [this.medicineList.price],
      edate: [''],
      stock: [this.medicineList.stock, [Validators.required]],
    });
  
    // Vérifiez si this.departmentList.d_date est définie avant de la formater
    if (this.medicineList.pdate) {
      formGroup.get('ddate')?.setValue(formatDate(this.medicineList.pdate, 'yyyy-MM-dd', 'en'));
    }
  
    // Ajoutez le validateur requis pour la date si nécessaire
    formGroup.get('pdate')?.setValidators(Validators.required);

    if (this.medicineList.pdate) {
      formGroup.get('edate')?.setValue(formatDate(this.medicineList.edate, 'yyyy-MM-dd', 'en'));
    }
  
    // Ajoutez le validateur requis pour la date si nécessaire
    formGroup.get('edate')?.setValidators(Validators.required);
  
    return formGroup;
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.medicineListService.addMedicineList(
      this.medicineListForm.getRawValue()
    );
  }
}
