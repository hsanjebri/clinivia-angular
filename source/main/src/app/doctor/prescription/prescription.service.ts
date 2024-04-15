import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, Observable} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {webSocket} from "rxjs/webSocket";
import {Prescription} from "./prescription.model";
import {Patient} from "../../admin/patients/allpatients/patient.model";

@Injectable({
  providedIn: 'root',
})


export class PrescriptionService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/itemStockList.json';
  private baseUrl :string ="http://localhost:8085/Examen/Prescriptions/getAll";
  private baseUrl1 :string ="http://localhost:8085/Examen/Prescriptions/add";
  private baseUrlUpt :string ="http://localhost:8085/Examen/Prescriptions/update";
  private  readonly  baseUrl3 ="http://localhost:8085/Examen/Prescriptions/delete/";

  webSocketUrl = 'http://your-backend-url/ws';


  isTblLoading = true;
  dataChange: BehaviorSubject<Prescription[]> = new BehaviorSubject<
    Prescription[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Prescription;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Prescription[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
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
  addItemStockList(itemStockList: Prescription ): void {
    this.dialogData = itemStockList;

    this.httpClient.post(this.baseUrl1, itemStockList  )
      .subscribe({
        next: (data) => {
          this.dialogData = itemStockList;


        },
        error: (error: HttpErrorResponse) => {
          // error code here
        },
      });
  }
  updateItemStockList(itemStockList: Prescription): Observable<any> {
    this.dialogData = itemStockList;

    return   this.httpClient.put(this.baseUrlUpt + itemStockList.id, itemStockList) ;

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

  // Function to handle incoming notifications
  handleNotification(message: any) {
    console.log('Received notification:', message);
    // Update UI or data based on the notification content (e.g., update equipment list)
  }


}
