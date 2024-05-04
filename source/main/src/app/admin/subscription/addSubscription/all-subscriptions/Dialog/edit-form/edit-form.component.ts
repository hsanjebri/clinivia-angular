import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { SubscriptionServiceService } from 'app/admin/subscription/subscription.service';
import { subscription } from 'app/admin/subscription/subscriptionModel';
import { FormDialogComponent } from 'app/calendar/dialogs/form-dialog/form-dialog.component';
import * as LR from "@uploadcare/blocks";

export interface DialogData  {
  id: number;
  action: string;
  subscription: subscription;
}


@Component({
  selector: 'app-edit-form',
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
        BreadcrumbComponent,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        FileUploadComponent,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule, 
        CommonModule,  
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.scss'
})
export class EditFormComponent implements OnInit {
  action: string ;
  //dialogTitle: string;
  sub?: subscription;
  subForm: UntypedFormGroup;
  isDisabled: boolean = true;
  @ViewChild('ctxProvider', { static: true }) ctxProvider!: ElementRef<
    typeof LR.UploadCtxProvider.prototype
  >;
  uploadedFiles: LR.OutputFileEntry[] = [];



  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public ss: SubscriptionServiceService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      console.log('first')
      //this.dialogTitle = data.sub.subscriptionType;
      this.sub = data.subscription;
    } else {
      console.log('else')
      //this.dialogTitle = data.sub.subscriptionType;
      const blankObject = {} as subscription;
      this.sub = new subscription(blankObject);
    }
    this.subForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      subscriptionID: [this.sub?.subscriptionID],
      img: [this.sub?.img],
      subscriptionType: [this.sub?.subscriptionType],
      contents: [this.sub?.contents],
      subscriptionFee: [this.sub?.subscriptionFee],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    console.log("this.subForm.getRawValue()")
    let sssss:subscription=this.subForm.getRawValue() as subscription
    sssss.byadmin=true
    sssss.img=this.uploadedFiles[0].cdnUrl || '';
    this.ss.addDoctors(sssss);
  }

  submit(){
    console.log(this.subForm.getRawValue())
  }
  ngOnInit(): void {
    this.ctxProvider.nativeElement.addEventListener(
      'file-upload-success',
      this.handleUploadEvent
    );
  }
  handleUploadEvent = (e: Event) => {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    if (e.detail) {
      this.uploadedFiles=[e.detail]
    }
  };
  
}
  

