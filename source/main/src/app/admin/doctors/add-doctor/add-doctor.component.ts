import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { DoctorsService } from '../doctors.service';
import { Router } from '@angular/router';
import { Doctors } from '../alldoctors/doctors.model';



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
  const confirmPassword = control.root.get('conformPassword');
  
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

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
  standalone: true,
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
    
  ],
})
export class AddDoctorComponent {
  docForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  doc!:Doctors
  fullname!:string
  constructor(private fb: UntypedFormBuilder , private ds:DoctorsService , private route:Router) {
    this.docForm = this.fb.group({
      first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last: [''],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required , mobileValidator]],
      password: ['', [Validators.required , passwordform , Validators.minLength(8)]],
      conformPassword: ['', [Validators.required , passwordMatchValidator]],
      specialization: [''],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)]
      ],
      date: ['', [Validators.required , minimumAgeValidator(18)]],
      degree: [''],
      uploadFile: [''],
      role:['']
    });
  }
  onSubmit() {
    console.log('Form Value', this.docForm.value);
    this.doc = this.docForm.value as Doctors
    this.doc.name = this.docForm.controls["first"].value+' '+this.docForm.controls["last"].value
    this.doc.role = 'DOCTOR'
    this.ds.addDoctors(this.doc)
  }
}
