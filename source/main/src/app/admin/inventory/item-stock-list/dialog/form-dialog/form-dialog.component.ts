import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ItemStockListService } from '../../item-stock-list.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemStockList } from '../../item-stock-list.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  itemStockList: ItemStockList;
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
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  itemStockListForm: UntypedFormGroup;
  itemStockList: ItemStockList;
    minDate = new Date(); // Today's date for minimum date selection

    constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public itemStockListService: ItemStockListService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.itemStockList.i_name;
      this.itemStockList = data.itemStockList;
    } else {
      this.dialogTitle = 'New ItemStockList';
      const blankObject = {} as ItemStockList;
      this.itemStockList = new ItemStockList(blankObject);
    }
    this.itemStockListForm = this.createContactForm();
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
        id: [this.itemStockList.id],
        i_name: [this.itemStockList.i_name, [Validators.required]],
        category: [this.itemStockList.category, [Validators.required]],
        qty: [this.itemStockList.qty, [Validators.required, Validators.min(1)]],
        date: [
            formatDate(this.itemStockList.date, 'yyyy-MM-dd', 'en'),
            [Validators.required ],
        ],
        price: [this.itemStockList.price, [Validators.required, Validators.min(0.01)]], // Minimum price of 0.01
        details: [this.itemStockList.details],
    });
  }
    dateValidator(control: UntypedFormControl): { [key: string]: boolean } | null {
        const forbiddenDate = new Date(control.value.date);
        return forbiddenDate.getTime() > this.minDate.getTime()
            ? { futureDate: true }
            : null;
    }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.itemStockListService.addItemStockList(
      this.itemStockListForm.getRawValue()
    );
  }
}
