import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { DepartmentList } from './funeral-list.model';

@Injectable({
  providedIn: 'root',
})

export class DepartmentListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/departmentList.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<DepartmentList[]> = new BehaviorSubject<
    DepartmentList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: DepartmentList;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): DepartmentList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllDepartmentLists(): void {
    this.subs.sink = this.httpClient
      .get<DepartmentList[]>(this.baseUrl)
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
  addDepartmentList(departmentList: DepartmentList): void {
    this.httpClient.post(this.API_URLadd, departmentList)
    .subscribe({
      next: (data) => {
        // Assuming the server responds with data after a successful POST request
        // You can keep the original assignment if it's intentional
        this.dialogData = departmentList;

        // Optionally, perform additional actions with the response data
        console.log('Response from the server:', data);
      },
      error: (error: HttpErrorResponse) => {
        // Handle error code here
        console.error('Error while making the request:', error);
      },
    });
  }
  updateDepartmentList(departmentList: DepartmentList): Observable<any> {
    this.dialogData = departmentList;
    
    return this.httpClient.put(this.API_URLupdate + departmentList.id, departmentList);
  }
  deleteDepartmentList(id: number): void {
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
  private baseUrl :string = "http://localhost:8085/Examen/funerals/getall"
  private readonly API_URLdelete = 'http://localhost:8085/Examen/funerals/delete/';
  private readonly API_URLadd = 'http://localhost:8085/Examen/funerals/add';
  private readonly API_URLupdate = 'http://localhost:8085/Examen/funerals/update';
}