import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DepartmentList } from './department-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
// ici je modif pr 2 proj sur dossier bur spring lie a ang//
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
      .get<DepartmentList[]>('http://localhost:8085/Examen/department/getall')
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
    this.dialogData = departmentList;

     this.httpClient.post('http://localhost:8085/Examen/department/add', departmentList)
      .subscribe({
       next: (data) => {
          this.dialogData = departmentList;
       },
         error: (error: HttpErrorResponse) => {
    //        // error code here
        },
       });
  }
  updateDepartmentList(departmentList: DepartmentList): void {
    this.dialogData = departmentList;

     this.httpClient.put('http://localhost:8085/Examen/department/update', departmentList)
       .subscribe({
         next: (data) => {
            this.dialogData = departmentList;
          },
           error: (error: HttpErrorResponse) => {
    //          // error code here
          },
       });
  }
  deleteDepartmentList(id: number): void {
    console.log(id);

     this.httpClient.delete(`http://localhost:8085/Examen/department/${id}`)
        .subscribe({
           next: (data) => {
            console.log(id);
          },
          error: (error: HttpErrorResponse) => {
             // error code here
          },
         });
  }
}
/** 
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DepartmentList } from './department-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class DepartmentListService extends UnsubscribeOnDestroyAdapter {
  [x: string]: any;
  private readonly API_URL = 'http://localhost:8081/Examen/department';

  isTblLoading = true;
  dataChange: BehaviorSubject<DepartmentList[]> = new BehaviorSubject<DepartmentList[]>([]);
  dialogData!: DepartmentList;

  constructor(private httpClient: HttpClient) {
    super();
  }

  getAllDepartmentLists(): void {
    this.subs.sink = this.httpClient
      .get<DepartmentList[]>(`http://localhost:8081/Examen/department/getall`)
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
    this.httpClient.post(`http://localhost:8081/Examen/department/add`, departmentList).subscribe({
      next: (data) => {
        this.dialogData = departmentList;
      },
      error: (error: HttpErrorResponse) => {
        // Gérer l'erreur ici
      },
    });
  }

  updateDepartmentList(departmentList: DepartmentList): void {
    this.httpClient.put(`http://localhost:8081/Examen/department/update`, departmentList).subscribe({
      next: (data) => {
        this.dialogData = departmentList;
      },
      error: (error: HttpErrorResponse) => {
        // Gérer l'erreur ici
      },
    });
  }

  deleteDepartmentList(id: number): void {
    this.httpClient.delete(`http://localhost:8081/Examen/department/${id}`).subscribe({
      next: (data) => {
        console.log(id);
      },
      error: (error: HttpErrorResponse) => {
        // Gérer l'erreur ici
      },
    });
  }
}*/
