import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DepartmentListService } from '../../funeral-list.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentList } from '../../funeral-list.model';
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
      this.dialogTitle = data.departmentList.contactPersonForArrangement;
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
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.departmentList.id],
      idPatient:[this.departmentList.idPatient],
      funeralServiceProvider: [this.departmentList.funeralServiceProvider],
      contactPersonForArrangement: [this.departmentList.contactPersonForArrangement],
      contactPersonRelationshipToPatient: [this.departmentList.contactPersonRelationshipToPatient],
      contactPersonPhoneNumber: [this.departmentList.contactPersonPhoneNumber],
      estimatedFuneralExpenses: [this.departmentList.estimatedFuneralExpenses],
    });
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
