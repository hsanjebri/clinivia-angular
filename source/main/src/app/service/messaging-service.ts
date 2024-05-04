import {Injectable} from "@angular/core";
import  {BehaviorSubject} from "rxjs";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
@Injectable()
export class MessagingService{
  currentMessage =new BehaviorSubject<any>(null);
  constructor(private angularFireMessaging:AngularFireMessaging) {
  }
  requestPermission() {
    this.angularFireMessaging.requestToken
      .subscribe(
        (token) => {
          console.log(token);
        },
        (err) => {
          console.error('Unable to get permission for notifications', err);
        }
      );
  }
  reciveMessaging(){
    this.angularFireMessaging.requestToken.subscribe((payload)=>{
      console.log("new message recivied",payload)
      this.currentMessage.next(payload)
    })

  }
}
