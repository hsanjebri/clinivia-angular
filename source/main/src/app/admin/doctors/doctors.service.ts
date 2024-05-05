import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctors } from './alldoctors/doctors.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Router } from '@angular/router';
import { User } from '@core';
import { List } from 'echarts';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = "http://localhost:8085/Examen/api/UserController";
  private baseUrl :string = "http://localhost:8085/Examen/api/UserController/getAllUsers"
  private readonly API_URLadd = "http://localhost:8085/Examen/api/UserController/addUser"
  private readonly API_URLupdate = "http://localhost:8085/Examen/api/UserController/updateUser"
  private readonly API_URLdelete = "http://localhost:8085/Examen/api/UserController/deleteUser/"


  isTblLoading = true;
  dataChange: BehaviorSubject<Doctors[]> = new BehaviorSubject<Doctors[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Doctors;
  constructor(private httpClient: HttpClient , /*private route:Router*/) {
    super();
  }
  get data(): Doctors[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getUs(){
    return this.httpClient.get<Doctors[]>(this.baseUrl)
  }
  getAllDoctorss(): Observable<Doctors> {
    this.subs.sink = this.httpClient
    .get<Doctors[]>(this.baseUrl)
    .subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
    return this.httpClient.get<Doctors>(this.baseUrl)
  }
  addDoctors(doctors: Doctors): void {
    this.dialogData = doctors;

    this.httpClient.post(this.API_URLadd, doctors)
      .subscribe({
        next: (data) => {
          this.dialogData = doctors;
          console.log('Response from the server:', data);
        },
        error: (error: HttpErrorResponse) => {
          // Handle error code here
          console.error('Error while making the request:', error);
        },
      });
  }
  updateDoctors(doctors: Doctors): Observable<any> {
    this.dialogData = doctors;
    return this.httpClient.put(this.API_URLupdate + doctors.id, doctors);
  }
  deleteDoctors(id: number): void {
    console.log(id);

    this.httpClient.delete(`${this.API_URLdelete}${id}`)
        .subscribe({
          next: (data) => {
            console.log(id);
          },
          error: (error: HttpErrorResponse) => {
              // error code here
          },
        });
  }

  checkEmailUnique(email: string): Observable<boolean> {
    console.log('Checking email:', email); 
    console.log(this.httpClient.get<boolean>(`${this.API_URL}/checkEmailUnique?email=${email}`))
    return this.httpClient.get<boolean>(`${this.API_URL}/checkEmailUnique?email=${email}`);
  }

  
}
