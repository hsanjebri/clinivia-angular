import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, Observable, throwError} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {webSocket} from "rxjs/webSocket";
import {Prescription} from "../../doctor/prescription/prescription.model";
import {MedicineList} from "../../admin/pharmacy/medicine-list/medicine-list.model";
import {AuthService} from "@core";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})


export class PrescriptionService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/itemStockList.json';
  private baseUrl :string ="http://localhost:8085/Examen/Prescriptions/getAll";
  private baseUrl1 :string ="http://localhost:8085/Examen/Prescriptions/add";
  private baseUrlUpt :string ="http://localhost:8085/Examen/Prescriptions/update";
  private  readonly  baseUrl3 ="http://localhost:8085/Examen/Prescriptions/delete/";
  private    baseUrlAddMed ="http://localhost:8085/Examen/Prescriptions/Addmedicines/";
  private    baseUrlGetMed ="http://localhost:8085/Examen/Prescriptions/GetMedicines";
  private baseUrlGet = 'http://localhost:8085/Examen/Prescriptions/GetPrescriptionsByDoctor/'; // Adjust URL based on your backend endpoint

  private Urlunapproved = 'http://localhost:8085/Examen/Prescriptions/unApproved'; // Adjust URL based on your backend endpoint

  webSocketUrl = 'http://your-backend-url/ws';

  doctorId! : number | undefined;

  isTblLoading = true;
  dataChange: BehaviorSubject<Prescription[]> = new BehaviorSubject<
    Prescription[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Prescription;
  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
    super();
  }
  get data(): Prescription[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */

 public  getAllUnapproved(): void {

    this.subs.sink = this.httpClient
      .get<Prescription[]>(`${this.Urlunapproved}`)
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
  public getPrescriptionsByDoctorId(): void {
    this.doctorId = this.authService.currentUserValue.id; // Retrieve doctorId from AuthService

    this.subs.sink = this.httpClient.get<Prescription[]>(`${this.baseUrlGet}${this.doctorId}`).subscribe({
      next: (data: Prescription[]) => {
        this.isTblLoading = false;
        this.dataChange.next(data); // Update the dataChange subject with the fetched prescriptions
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.name + 'hhhhhhh' + error.message);
      }
    });
  }
  getAllItemStockLists(): void {
    this.subs.sink = this.httpClient
      .get<Prescription[]>(this.baseUrl)
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
  addItemStockList(itemStockList: Prescription ): Observable<Prescription> {
    this.dialogData = itemStockList;

    return  this.httpClient.post<Prescription>(this.baseUrl1, itemStockList  );

  }
  updateItemStockList(itemStockList: Prescription): Observable<Object> {
    return this.httpClient.put(this.baseUrlUpt, itemStockList).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors here, e.g., log the error or show a user-friendly message
        console.error('An error occurred:', error);
        // Return an observable with the error message
        return throwError('Something went wrong, please try again later.');
      })
    );
  }

  deleteItemStockList(id: number): void {
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

  // WebSocket connection subject
  private socketSubject = new BehaviorSubject<any>(null);
  public socket$: Observable<any> = this.socketSubject.asObservable();

  //notification shadha

  public connect(): Observable<any> {
    if (!this.socket$) {
      this.socket$ = webSocket(this.webSocketUrl);
      this.socketSubject.next(this.socket$); // Emit the connected WebSocket observable
    }
    return this.socket$;
  }

  handleNotification(message: any) {
    console.log('Received notification:', message);
    // Update UI or data based on the notification content (e.g., update equipment list)
  }

  addMedicinesToPrescription(PrescripitonId: number, MedicinesIds: Set<number>): Observable<any> {
    return this.httpClient.post(this.baseUrlAddMed + PrescripitonId, Array.from(MedicinesIds));
  }
  getMedicinesByPrescriptionId(PrescriptionId: number): Observable<MedicineList[]> {
    return this.httpClient.get<MedicineList[]>(this.baseUrlGetMed +PrescriptionId);
  }


}
