import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MedicineList } from './medicine-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

const categoryOrder = ['Service et Prix', 'Service', 'Prix'];
@Injectable({
  providedIn: 'root',
})

export class MedicineListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/medicineList.json';
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
  getAllMedicineLists(): void {
    this.subs.sink = this.httpClient
      .get<MedicineList[]>('http://localhost:8085/Examen/complaint/getall')
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
  addMedicineList(medicineList: MedicineList): void {
    this.dialogData = medicineList;

     this.httpClient.post('http://localhost:8085/Examen/complaint/add', medicineList)
       .subscribe({
        next: (data) => {
           this.dialogData = medicineList;
         },
         error: (error: HttpErrorResponse) => {
    //        // error code here
         },
       });
  }
  updateMedicineList(medicineList: MedicineList): void {
    this.dialogData = medicineList;

     this.httpClient.put('http://localhost:8085/Examen/complaint/update', medicineList)
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

     this.httpClient.delete(`http://localhost:8085/Examen/complaint/${id}`)
         .subscribe({
           next: (data) => {
             console.log(id);
           },
           error: (error: HttpErrorResponse) => {
              // error code here
           },
         });
  }
  // pour trier le tableau 
  /// nouvvvvvvvvvvvv 
getAllMedicineListsByCategory(): void {
  this.subs.sink = this.httpClient
    .get<MedicineList[]>('http://localhost:8085/Examen/complaint/getall')
    .subscribe({
      next: (data) => {
        this.isTblLoading = false;
        // Classer les réclamations par catégorie
        const sortedData = this.sortDataByCategory(data);
        this.dataChange.next(sortedData);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
}

private sortDataByCategory(data: MedicineList[]): MedicineList[] {
  // Triez les données en fonction de la catégorie
  const sortedData = data.sort((a, b) => {
    // Si les deux ont une catégorie "service" ou une catégorie "prix",
    // alors triez en fonction de la priorité de la catégorie
    if ((a.category === 'service' && b.category === 'prix') || (a.category === 'prix' && b.category === 'service')) {
      // Si a est "service" et b est "prix", alors "service" vient en premier
      return a.category === 'service' ? -1 : 1;
    }
    // Sinon, triez normalement en fonction de la catégorie
    return a.category.localeCompare(b.category);
  });

  return sortedData;
}




}
