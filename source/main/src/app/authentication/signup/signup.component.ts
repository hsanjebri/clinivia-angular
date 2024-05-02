import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { DoctorsService } from 'app/admin/doctors/doctors.service';
import { Observable, of } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatSelectModule } from '@angular/material/select';
import { Doctors } from 'app/admin/doctors/alldoctors/doctors.model';




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


    ],
})
export class SignupComponent implements OnInit {
  doc!:Doctors;
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
    private ds:DoctorsService
  ) { }
  ngOnInit() {
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
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.doc = this.authForm.value as Doctors
    this.doc.name = this.authForm.controls["username"].value
    // stop here if form is invalid
    if (this.authForm.invalid) {
      console.log("iiiiiiinvalid")
      return;
    } else {
      this.ds.addDoctors(this.authForm.value as any)
      this.router.navigate(['/authentication/signin']);
      //this.router.navigate(['/admin/dashboard/main']);
    }
  }
}
