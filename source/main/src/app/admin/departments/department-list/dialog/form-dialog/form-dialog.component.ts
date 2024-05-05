import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DepartmentListService } from '../../department-list.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentList } from '../../department-list.model';
import { formatDate } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  departmentList: DepartmentList;
}

@Component({
    selector: 'app-form-dialog:not(e)',
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
        MatRadioModule,
        MatDialogClose,
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  departmentListForm: UntypedFormGroup;
  departmentList: DepartmentList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public departmentListService: DepartmentListService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.departmentList.dname;
      this.departmentList = data.departmentList;
    } else {
      this.dialogTitle = 'New DepartmentList';
      const blankObject = {} as DepartmentList;
      this.departmentList = new DepartmentList(blankObject);
    }
    this.departmentListForm = this.createContactForm();
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
  /** commrnter par moi pr le 2 proj spronh lie a ang sur un dosssier dans bureau pas l'autre sur bur dierctm
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.departmentList.id],
      d_no: [this.departmentList.d_no],
      d_name: [this.departmentList.d_name],
      description: [this.departmentList.description],
      d_date: [
        formatDate(this.departmentList.d_date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      d_head: [this.departmentList.d_head],
      status: [this.departmentList.status],
    });
  }*/
  createContactForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      id: [this.departmentList.id],
      dno: [this.departmentList.dno],
      dname: [this.departmentList.dname],
      description: [this.departmentList.description],
      ddate: [''], // Initialiser avec une chaîne vide pour éviter les erreurs si la date est undefined
      dhead: [this.departmentList.dhead],
      status: [this.departmentList.status],
    });
  
    // Vérifiez si this.departmentList.d_date est définie avant de la formater
    if (this.departmentList.ddate) {
      formGroup.get('ddate')?.setValue(formatDate(this.departmentList.ddate, 'yyyy-MM-dd', 'en'));
    }
  
    // Ajoutez le validateur requis pour la date si nécessaire
    formGroup.get('ddate')?.setValidators(Validators.required);
  
    return formGroup;
  }
  

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.departmentListService.addDepartmentList(
      this.departmentListForm.getRawValue()
    );
  }
}
