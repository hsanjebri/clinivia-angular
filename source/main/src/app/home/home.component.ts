import {Component, inject} from '@angular/core';
import { Router } from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  roomId: string = '';
  route =inject(Router)

  constructor(private router: Router) {}
  enterRoom() {
    console.log(this.roomId);
    this.route.navigateByUrl(`/room/${this.roomId}`);
  }
}
