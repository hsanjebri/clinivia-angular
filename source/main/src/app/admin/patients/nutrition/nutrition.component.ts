import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  standalone: true,
  imports: [
    BreadcrumbComponent
  ],
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit {
  private readonly API_ASSESS_INTAKE = 'http://localhost:8081/Examen/dietplan/assess/';
  assessmentResults: string = ''; // Change to string type

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('patientId');
    if (patientId) {
      this.assessNutritionalIntake(+patientId).subscribe(
        (assessmentResults: never) => { // Update type here
          console.log(assessmentResults);
          this.assessmentResults = JSON.stringify(assessmentResults); // Convert object to string
          this.snackBar.open('Nutritional intake assessed successfully!', 'Close', {
            duration: 3000
          });
        },
        (error) => {
          console.error('Error assessing nutritional intake:', error);
          this.snackBar.open('Error assessing nutritional intake!', 'Close', {
            duration: 3000
          });
        }
      );
    }
  }

  assessNutritionalIntake(patientId: number): Observable<never> { // Update return type here
    const url = `${this.API_ASSESS_INTAKE}${patientId}`;
    return this.httpClient.get<never>(url); // Update return type here
  }
}
