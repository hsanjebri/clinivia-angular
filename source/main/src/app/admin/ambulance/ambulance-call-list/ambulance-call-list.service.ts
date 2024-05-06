import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AmbulanceCallList } from './ambulance-call-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AmbulanceList } from '../ambulance-list/ambulance-list.model';

@Injectable({
  providedIn: 'root',
})
export class AmbulanceCallListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/ambulanceCallList.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<AmbulanceCallList[]> = new BehaviorSubject<
    AmbulanceCallList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: AmbulanceCallList;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): AmbulanceCallList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAmbulanceCallLists(): void {
    this.subs.sink = this.httpClient
      .get<AmbulanceCallList[]>(this.baseUrl)
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

  addAmbulanceCallList(ambulanceCallList: AmbulanceCallList): void {
    this.httpClient.post(this.API_URLadd, ambulanceCallList)
      .subscribe({
        next: (data) => {
          this.dialogData = ambulanceCallList;
          console.log('Response from the server:', data);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while making the request:', error);
        },
      });
  }
  updateAmbulanceCallList(ambulanceCallList: AmbulanceCallList): Observable<any> {
    this.dialogData = ambulanceCallList;
    
    return this.httpClient.put(this.API_URLupdate + ambulanceCallList.id, ambulanceCallList);
  }
  deleteAmbulanceCallList(id: number): void {
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


  private baseUrl :string = "http://localhost:8085/Examen/api/Ambulancedispatch/getAll"
  private  API_URLadd:string  = 'http://localhost:8085/Examen/api/Ambulancedispatch/add';
  private  API_URLupdate:string = 'http://localhost:8085/Examen/api/Ambulancedispatch/update';
  private readonly API_URLdelete = 'http://localhost:8085/Examen/api/Ambulancedispatch/delete/';
}
