import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {MealListService} from "../bill-list/meal-list.service";

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
})
export class AddMealComponent {
  billForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder,private billListService: MealListService) {
    this.billForm = this.fb.group({
      recommendedMeal: ['', [Validators.required]],
      ingredients: ['', [Validators.required]],
      calories: ['', [Validators.required]],
      protein: ['', [Validators.required]],
      recommendationDate: ['', [Validators.required]],
      fat: ['', [Validators.required]],
      carbohydrates: ['', [Validators.required]],
      cholesterol: ['', [Validators.required]],
    });
  }
  onSubmit() {
    this.billListService.addBillList(this.billForm.getRawValue());
    console.log('Form Value', this.billForm.value);

  }
}

