import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { subscription } from './subscriptionModel';
import { DoctorsService } from '../doctors/doctors.service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionServiceService extends UnsubscribeOnDestroyAdapter {
  
  private readonly addLink = "http://localhost:8085/Examen/api/SubscriptionController/addSubscription"
  private readonly updateLink = "http://localhost:8085/Examen/api/SubscriptionController/updateSubscription"
  private readonly getallLink = "http://localhost:8085/Examen/api/SubscriptionController/getAllSubscription"
  private readonly getoneLink = "http://localhost:8085/Examen/api/SubscriptionController/getSubscriptionById/"
  private readonly deleteLink = "http://localhost:8085/Examen/api/SubscriptionController/deleteSubscription/"

  dataChange: BehaviorSubject<subscription[]> = new BehaviorSubject<subscription[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: subscription;

  constructor(private httpClient: HttpClient , private ds: DoctorsService) {
    super();
   }
   getDialogData() {
    return this.dialogData;
  }
   get data(): subscription[] {
    return this.dataChange.value;
  }
  addSub(sub: subscription){
    return this.httpClient.post(this.addLink , sub)
  }

  addDoctors(doctors: subscription): void {
    this.dialogData = doctors;

    this.httpClient.post(this.updateLink, doctors)
      .subscribe({
        next: (data) => {
          this.dialogData = doctors;
          console.log('Response from the server:', data);
        },
      });
  }

  updateSub(sub: subscription){
    console.log(sub)
    return this.httpClient.put<subscription>(this.updateLink  , sub)
  }
  getSubById(id: Number){
    return this.httpClient.get<subscription>(this.getoneLink + id)
  }
  getAllSub(){
    return this.httpClient.get<subscription[]>(this.getallLink) 
  }
  deleteSub(id: number){
    return this.httpClient.delete(this.deleteLink + id)
  }
}
