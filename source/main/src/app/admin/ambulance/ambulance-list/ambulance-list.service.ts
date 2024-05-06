import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { AmbulanceList } from './ambulance-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})

export class AmbulanceListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/ambulanceList.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<AmbulanceList[]> = new BehaviorSubject<
    AmbulanceList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: AmbulanceList;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): AmbulanceList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAmbulanceLists(): void {
    this.subs.sink = this.httpClient
      .get<AmbulanceList[]>(this.baseUrl)
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
  }
    addAmbulanceList(ambulanceList: AmbulanceList): void {
      this.httpClient.post(this.API_URLadd, ambulanceList)
        .subscribe({
          next: (data) => {
            // Assuming the server responds with data after a successful POST request
            // You can keep the original assignment if it's intentional
            this.dialogData = ambulanceList;
    
            // Optionally, perform additional actions with the response data
            console.log('Response from the server:', data);
          },
          error: (error: HttpErrorResponse) => {
            // Handle error code here
            console.error('Error while making the request:', error);
          },
        });
    }
    updateAmbulanceList(ambulanceList: AmbulanceList): Observable<any> {
      this.dialogData = ambulanceList;
    
      return this.httpClient.put(this.API_URLupdate + ambulanceList.id, ambulanceList);
    }
 /* deleteAmbulanceList(id: number): void {
   // console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
     });
  }*/
  private baseUrl :string = "http://localhost:8085/Examen/api/Ambulances/getAll"
  private readonly API_URLdelete = 'http://localhost:8085/Examen/api/Ambulances/delete/';
  private readonly API_URLadd = 'http://localhost:8085/Examen/api/Ambulances/add';
  private readonly API_URLupdate = 'http://localhost:8085/Examen/api/Ambulances/update';
  deleteAmbulanceList(id: number): void {
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


  /*findAllAmbulances():Observable<AmbulanceList[]>{
    return this.httpClient.get<AmbulanceList[]>(this.baseUrl);
  }*/
}