import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BillList } from './meal-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})

export class MealListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'http://localhost:8085/Examen/mealrecommendation/getall';
  private readonly API_URLADD = 'http://localhost:8085/Examen/mealrecommendation/add'; // Remove {id} placeholder
  private readonly API_URLdelete = 'http://localhost:8085/Examen/mealrecommendation/delete/'; // Remove {id} placeholder
  private readonly API_UPDATE = 'http://localhost:8085/Examen/mealrecommendation/update';

  isTblLoading = true;
  dataChange: BehaviorSubject<BillList[]> = new BehaviorSubject<BillList[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: BillList;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): BillList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllBillLists(): void {
    this.subs.sink = this.httpClient.get<BillList[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
        console.log("data",data);
        console.log("dataaaaaaaaaaaaaaaaaaa");
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  addBillList(billList: BillList): void {
    this.dialogData = billList;
    this.httpClient.post<BillList>(this.API_URLADD, billList)
      .subscribe({
        next: (data) => {
          this.dialogData = billList;
          this.dataChange.value.push(data);
          this.dataChange.next(this.dataChange.value);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding patient:', error);
        },
      });
  }
  updateBillList(billList: BillList): void {
    this.dialogData = billList;

    this.httpClient.put(this.API_UPDATE,billList)
      .subscribe({
        next: (data) => {
          this.dialogData = billList;
          console.log('Patient updated successfully:', data);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating patient:', error);
        },
      });
  }
  deleteBillList(id: number): void {
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
}
