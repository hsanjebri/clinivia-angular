import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { PatientService } from "../allpatients/patient.service";
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { NgClass } from "@angular/common";
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
  selector: 'app-showprogress',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgClass,
    MatProgressBar
  ],
  templateUrl: './showprogress.component.html',
  styleUrl: './showprogress.component.scss'
})
export class ShowprogressComponent implements OnInit {
  patientId: number | undefined;
  progressPercentage: number | undefined;
  taskCompletionPercentages: { [key: number]: number } = {}; // Dictionary to store task completion percentages
  exampleDatabase?: PatientService;

  constructor(private route: ActivatedRoute, private patientService: PatientService) {}

  ngOnInit() {
    this.route.params.subscribe((params: { [x: string]: string | number; }) => {
      const idParam = params['patientId']; // Assuming 'patientId' is the parameter name
      this.patientId = typeof idParam === 'string' ? parseInt(idParam, 10) : undefined; // Parse the parameter as a number

      if (this.patientId !== undefined) { // Check if patientId is defined
        console.log('Patient ID:', this.patientId); // Display patientId in the console
        this.loadProgressData();
      }
    });
  }

  loadProgressData() {
    if (this.patientId !== undefined) {
      this.patientService.getTaskCompletionPercentage(this.patientId).subscribe(
        (percentage: number) => {
          this.progressPercentage = percentage;
        },
        (error) => {
          console.error('Error fetching progress data:', error);
        }
      );
    } else {
      console.error('Patient ID is undefined. Cannot load progress data.');
    }
  }

  loadTaskCompletionPercentages() {
    // Assuming this method is called to fetch task completion percentages for all patients
    this.exampleDatabase?.dataChange.value.forEach(patient => {
      this.patientService.getTaskCompletionPercentage(patient.idPatient).subscribe(
        (percentage: number) => {
          this.taskCompletionPercentages[patient.idPatient] = percentage; // Store the percentage for the patient
        },
        (error) => {
          console.error('Error fetching task completion percentage:', error);
        }
      );
    });
  }
}
