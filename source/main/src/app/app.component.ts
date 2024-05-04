import { CommonModule } from '@angular/common';
import { Event, Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import {Component, OnInit} from "@angular/core";
import {getMessaging,getToken} from 'firebase/messaging'
import {environment} from "../environments/environment";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageLoaderComponent,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  implements  OnInit {
  currentUrl!: string;

  constructor(public _router: Router) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        /* empty */
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit(): void {
    this.requestPermission();
  }

  title = 'notification-web ';

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, {vapidKey: environment.firebase.vapidKey}).then(
      (currentToken) => {
        if (currentToken) {
          console.log("yeah boy");
          console.log(currentToken);
        } else
          console.log("no boy");
      }
    )
  }
}
