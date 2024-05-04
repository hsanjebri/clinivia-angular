import { Injectable } from '@angular/core';

import {BehaviorSubject, filter, Observable, of, throwError} from 'rxjs';
import { Patient } from './patient.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})

export class PatientService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:8081/Examen/patients/getall';
  private readonly API_URLdelete = 'http://localhost:8081/Examen/patients/delete/'; // Remove {id} placeholder
  private readonly API_URLADD = 'http://localhost:8081/Examen/patients/add'; // Remove {id} placeholder
  private readonly API_UPDATE = 'http://localhost:8081/Examen/patients/update';
  private readonly API_URLL = 'http://localhost:8081/Examen/patients'; // Replace with your actual API base URL
  private readonly API_ASSESS_INTAKE = 'http://localhost:8081/Examen/dietplan/assess/'; // Replace with your actual URL

  isTblLoading = true;
  dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Patient;


  constructor(private httpClient: HttpClient) {
    super();
  }

  get data(): Patient[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllPatients(): void {
    this.subs.sink = this.httpClient.get<Patient[]>(this.API_URL).subscribe({
      next: (data) => {
        console.log(data);
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  // addPatient(patient: Patient): void {
  //   this.dialogData = patient;
  //
  //   this.httpClient.post(this.API_URL, patient)
  //     .subscribe({
  //       next: (data) => {
  //         this.dialogData = patient;
  //       },
  //       error: (error: HttpErrorResponse) => {
  //          // error code here
  //       },
  //     });
  // }

  addPatient(patient: Patient): void {
    this.httpClient.post<Patient>(this.API_URLADD, patient)
      .subscribe({
        next: (data) => {
          this.dialogData = patient;
          // Add the new patient to the data source
          this.dataChange.value.push(data);
          // Emit the updated data source
          this.dataChange.next(this.dataChange.value);
          // Optionally, you can also emit an event or trigger a refresh on the component using a Subject or EventEmitter
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding patient:', error);
        },
      });
  }


  updatePatient(patient:Patient): void {
    this.httpClient.put(this.API_UPDATE,patient)
      .subscribe({
        next: (data) => {
          this.dialogData = patient;
          console.log('Patient updated successfully:', data);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating patient:', error);
        },
      });
  }

  deletePatient(id: number): void {
    console.log(id);

    this.httpClient.delete(`${this.API_URLdelete}${id}`)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error: HttpErrorResponse) => {
          // Handle error
          console.error('Delete request failed:', error);
        },
      });
  }
  getTaskCompletionPercentage(patientId: number): Observable<number> {
    const url = `${this.API_URLL}/${patientId}/task-completion-percentage`;
    return this.httpClient.get<number>(url);
  }

  assessNutritionalIntake(patientId: number): Observable<Map<Date, string>> {
    const url = `${this.API_ASSESS_INTAKE}${patientId}`;
    return this.httpClient.get<Map<Date, string>>(url);
  }



}

