import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { subscription } from '../../subscriptionModel';
import { BrowserModule } from '@angular/platform-browser';
import * as LR from "@uploadcare/blocks";
import { CommonModule } from '@angular/common';
import { SubscriptionServiceService } from '../../subscription.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss',
  imports: [
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
})
export class AddSubscriptionComponent implements OnInit {
  @ViewChild('ctxProvider', { static: true }) ctxProvider!: ElementRef<
    typeof LR.UploadCtxProvider.prototype
  >;
  uploadedFiles: LR.OutputFileEntry[] = [];
  subtiers?: Observable<String[]>
  sub?: subscription;
  subForm: UntypedFormGroup;
  isFreeTierSelected: boolean = false;
  isBASICTierSelected: boolean = false;
  isPREMIUMTierSelected: boolean = false;
  constructor(private fb: UntypedFormBuilder , private route:Router , private ss: SubscriptionServiceService) {
    this.subForm = this.fb.group({
      subscriptionType: ['', [Validators.required]],
      contents: ['', [Validators.required]],
      subscriptionFee: ['', [Validators.required , Validators.pattern('[. 0-9]+')]],
      subscriptionDuration: ['', [Validators.required , Validators.pattern('[. 0-9]+')]],
      uploadFile: [''],
    });
    
  }
  ngOnInit(){
    this.subtiers =  this.ss.getAllSub().pipe(
      map(m=> m.map(tier => tier.subscriptionType))
    );
    this.subtiers.forEach(tier =>{
      if (tier.includes('FREE'))
        this.isFreeTierSelected = true;
      if (tier.includes('BASIC'))
        this.isBASICTierSelected = true;
      if (tier.includes('PREMIUM'))
        this.isPREMIUMTierSelected = true;
    })
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
  onSubmit(){
    this.sub = this.subForm.value as subscription;
    this.sub.byadmin = true;
    this.sub.img = this.uploadedFiles[0].cdnUrl || ""
    this.sub.subscriptionDateOfCreation =  Date()
    this.ss.addSub(this.sub).subscribe({})
    window.location.reload();
  }
}
  


