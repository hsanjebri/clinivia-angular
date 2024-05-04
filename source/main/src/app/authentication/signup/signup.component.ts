import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { DoctorsService } from 'app/admin/doctors/doctors.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatSelectModule } from '@angular/material/select';
import { Doctors } from 'app/admin/doctors/alldoctors/doctors.model';
import { PatientService } from 'app/admin/patients/allpatients/patient.service';
import { Patient } from 'app/admin/patients/allpatients/patient.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core';
import { BrowserModule } from '@angular/platform-browser';
import * as LR from "@uploadcare/blocks";

LR.registerBlocks(LR);
//import { UploaderComponent } from './uploader.component';


function minimumAgeValidator(minimumAge: number) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const birthdateValue = control.value;

    const currentDate = new Date();
    const minimumDate = new Date();
    minimumDate.setFullYear(minimumDate.getFullYear() - minimumAge);

    const birthdate = new Date(birthdateValue);

    if (birthdate > minimumDate) {
      return { minimumAge: true };
    }
    return null;
  };
}

function uniqueEmailValidator(userService:DoctorsService) {
  return (control: AbstractControl) => {
    return new Promise(resolve => {
      if (!control.value) {
        resolve(null); 
      } else {
        userService.checkEmailUnique(control.value).subscribe(isUnique => {
          resolve(isUnique ? null : { emailNotUnique: true });
        });
      }
    });
  };
}

function mobileValidator(control: FormControl) {
  const mobileNumber = control.value;
  const mobilePattern = /^[0-9]{8}$/;
  if (!mobilePattern.test(mobileNumber)) {
    return { invalidMobile: true };
  }

  return null;
}

function passwordMatchValidator(control: FormControl) {
  const password = control.root.get('password');
  const confirmPassword = control.root.get('cpassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  if (confirmPassword.value === '') {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  } 
  
  else {
    return null;
  }
}

function passwordform(control: FormControl){
  const password = control.root.get('password');
  const passwordValue = password?.value;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(passwordValue)) {
    return { passwordRequirements: true };
  }

  return null;
}

export function rolevalid(control: FormControl): 
  Observable<ValidationErrors | null> {
    const role = control.root.get('role')
    const rolevalue = role?.value;
    if (!['Doctor', 'Patient', 'Healthcare Staff'].includes(rolevalue)){
      return of({rolenonvalid : true})
    }
    return of(null);
  }

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        RouterLink,
        MatButtonModule,
        MatOptionModule,
        MatDatepickerModule,
        BreadcrumbComponent,
        MatSelectModule,
        FileUploadComponent,
        CommonModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignupComponent implements OnInit {
  @ViewChild('ctxProvider', { static: true }) ctxProvider!: ElementRef<
    typeof LR.UploadCtxProvider.prototype
  >;
  uploadedFiles: LR.OutputFileEntry[] = [];
  doc!:Doctors;
  pat!:Patient;
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  selectedRole: string = '';
  hide = true;
  chide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ds:DoctorsService,
    private ps:PatientService,
    private aut:AuthService,
    private http: HttpClient
  ) { }
  ngOnInit() {
    this.ctxProvider.nativeElement.addEventListener(
      'file-upload-success',
      this.handleUploadEvent
    );
    this.ctxProvider.nativeElement.addEventListener(
      'done-flow',
      this.handleDoneFlow
    );
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      gender: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5), uniqueEmailValidator]
      ],
      password: ['', [Validators.required , passwordform , Validators.minLength(8)]],
      cpassword: ['', [Validators.required , passwordMatchValidator]],
      role: ['', [Validators.required]], // Pass rolevalid as async validator
      address: [''],
      date: ['', [Validators.required , minimumAgeValidator(18)]],
      uploadFile: [''],
      mobile: ['', [Validators.required , /*mobileValidator(this.ds)*/]],
      degree: [''],
      specialization: [''],
      department: [''],
      designation: ['']
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  handleUploadEvent = (e: Event) => {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    if (e.detail) {
      this.uploadedFiles=[e.detail]
      //this.uploadedFiles = e.detail as LR.OutputFileEntry[];
    }
  };

  handleDoneFlow = () => {
    console.log('handleDoneFlow');
  };

  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    
    this.submitted = true;
    this.doc = this.authForm.value as Doctors
    this.doc.img = this.uploadedFiles[0].cdnUrl || "j"
    this.doc.name = this.authForm.controls["username"].value
    this.pat = this.authForm.value as Patient
    this.pat.img = this.uploadedFiles[0].cdnUrl || "j"
    if (this.authForm.invalid) {
      console.log("iiiiiiinvalid")
      return;
    } else {
      let ttt = this.authForm.value as Patient;
        if(this.authForm.get('role')?.value != 'Patient')
          this.ds.addDoctors(this.doc as any)
        if(this.authForm.get('role')?.value == 'Patient')
          this.ps.addPatient(this.doc as any)
      this.router.navigate(['/authentication/signin']);
    }
  }
  
}
