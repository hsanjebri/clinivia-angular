import { Component } from '@angular/core';
import { Router } from '@angular/router';// ajouter par moi sur 2 proj sprng lie a angular sur bureau//
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { DepartmentListService } from '../department-list/department-list.service';//ajouter par moi sur 2 proj//
@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
})
export class AddDepartmentComponent {
  departForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder , private departmentService: DepartmentListService,
    private router: Router // Injectez le service Rout
    ) {
    this.departForm = this.fb.group({
      dno: ['', [Validators.required]],
      dname: ['', [Validators.required]],
      description: ['', [Validators.required]],
      ddate: ['', [Validators.required]],
      dhead: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
    });
  }
  /** commenter par moi sur le 2 proj sprong lie a ang sur bureau
  onSubmit() {
    console.log('Form Value', this.departForm.value);
  }*/
   onSubmit() {
    if (this.departForm.valid) {
      this.departmentService.addDepartmentList(this.departForm.value);
      this.router.navigate(['/admin/departments/department-list']); // Utilisez le service Router pour naviguer
    }
  }
}
