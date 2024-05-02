import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, Observable} from 'rxjs';
import { ItemStockList } from './item-stock-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root',
})
// items: ItemStockList[] = this.itemStockListService.getAllItemStockLists();
// qrCodeUrls =  this.generateQRCodesForItems(this.items);
/*
  private generateQRCodeForItem(item: Item): Promise<string> {
    return new Promise((resolve) => {
      const qrCodeData = JSON.stringify(item);
      QRCode.toDataURL(qrCodeData, (_: any, qrCodeUrl: string) => {
        resolve(qrCodeUrl);
      });
    });
  }

  private async generateQRCodesForItems(items: Item[]): Promise<string[]> {
    const qrCodeUrls: string[] = [];
    for (const item of items) {
      try {
        const qrCodeUrl = await this.generateQRCodeForItem(item);
        qrCodeUrls.push(qrCodeUrl);
      } catch (error) {
        console.error('QR code generation failed:', error);
      }
    }
    return qrCodeUrls;
  }
*/
export class ItemStockListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/itemStockList.json';
  private baseUrl :string ="http://localhost:8085/Examen/Equipments/getAll";
  private baseUrl1 :string ="http://localhost:8085/Examen/Equipments/add";
  private baseUrlUpt :string ="http://localhost:8085/Examen/Equipments/update";
  private  readonly  baseUrl3 ="http://localhost:8085/Examen/Equipments/delete/";

  private listEq :string ="http://localhost:8085/Examen/Equipments/getCategoryItemCounts";
  private Categ :string ="http://localhost:8085/Examen/Equipments/categories";

  baseUrlN = 'http://localhost:8085/Examen/Equipments/'; // Replace with your actual backend URL
  webSocketUrl = 'http://your-backend-url/ws';




  isTblLoading = true;
  dataChange: BehaviorSubject<ItemStockList[]> = new BehaviorSubject<
    ItemStockList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: ItemStockList;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): ItemStockList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllItemStockLists(): void {
    this.subs.sink = this.httpClient
      .get<ItemStockList[]>(this.baseUrl)
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
  addItemStockList(itemStockList: ItemStockList): void {
    this.dialogData = itemStockList;

     this.httpClient.post(this.baseUrl1, itemStockList)
       .subscribe({
         next: (data) => {
           this.dialogData = itemStockList;
         },
         error: (error: HttpErrorResponse) => {
            // error code here
         },
       });
  }
  updateItemStockList(itemStockList: ItemStockList): Observable<any> {
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
//get equipment by catego
  Items():Observable<Object>{
      return this.httpClient.get(this.baseUrl );

      }


  GetCategories() {
   return  this.httpClient.get<string[]>(this.Categ);

  }




}
