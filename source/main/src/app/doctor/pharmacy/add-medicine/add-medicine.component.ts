import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MedicineListService } from '../medicine-list/medicine-list.service';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
})
export class AddMedicineComponent {
  medecForm:UntypedFormGroup;
  /*medicineListForm: UntypedFormGroup;*/
  constructor(private fb: UntypedFormBuilder , private medicineService: MedicineListService,
    private router: Router
  ) {
    this.medecForm = this.fb.group({
      mno: ['', [Validators.required]],
      mname: ['', [Validators.required]],
      category: ['', [Validators.required]],
      company: ['', [Validators.required]],
      pdate: ['', [Validators.required]],
      price: ['', [Validators.required]],
      edate: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });
  }
 /* onSubmit() {
    console.log('Form Value', this.medicineListForm.value);
  }*/
  onSubmit() {
    if (this.medecForm.valid) {
      this.medicineService.addMedicineList(this.medecForm.value);
      this.router.navigate(['/doctor/pharmacy/medicine-list']); // Utilisez le service Router pour naviguer
    }
  }
}
