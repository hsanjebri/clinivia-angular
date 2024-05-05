import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { MedicineList } from './medicine-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {Prescription} from "../../../doctor/prescription/prescription.model";

@Injectable({
  providedIn: 'root',
})

export class MedicineListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/medicineList.json';


  private baseUrl :string ="http://localhost:8085/Examen/Medicines/getAll";
  private baseUrl1 :string ="http://localhost:8085/Examen/Medicines/add";
  private baseUrlUpt :string ="http://localhost:8085/Examen/Medicines/update";
  private  readonly  baseUrl3 ="http://localhost:8085/Examen/Medicines/delete/";
  isTblLoading = true;
  dataChange: BehaviorSubject<MedicineList[]> = new BehaviorSubject<
    MedicineList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: MedicineList;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): MedicineList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllMedicineLists(): Observable<MedicineList[]> {

    return  this.httpClient.get<MedicineList[]>(this.baseUrl)
  }

  getAllItemStockLists(): void {
    this.subs.sink = this.httpClient
      .get<MedicineList[]>(this.baseUrl)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
          console.log(data)
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      });
  }
  addMedicineList(medicineList: MedicineList): void {
    this.dialogData = medicineList;

     this.httpClient.post(this.baseUrl1, medicineList)
       .subscribe({
         next: (data) => {
           this.dialogData = medicineList;
         },
         error: (error: HttpErrorResponse) => {
            // error code here
         },
       });
  }
  updateMedicineList(medicineList: MedicineList): void {
    this.dialogData = medicineList;

     this.httpClient.put(this.baseUrlUpt + medicineList.id, medicineList)
         .subscribe({
          next: (data) => {
             this.dialogData = medicineList;
          },
          error: (error: HttpErrorResponse) => {
             // error code here
           },
         });
  }
  deleteMedicineList(id: number): void {
    console.log(id);

     this.httpClient.delete(this.baseUrl3 + id)
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
