import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  @ViewChild('root', { static: true }) root!: ElementRef;
  roomID: string = ''; // Change to primitive 'string' type

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roomID = params['roomId'];
    });
  }

  ngAfterViewInit(): void {
    const appID = 646069568;
    const serverSecret = '49ad0c5678c956e71315182c1d8e5cd9';

    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      this.roomID,
      appID.toString(), // Convert appID to string
      'ggg',
      Date.now(),
    );

    // create instance object from token
    const zp = ZegoUIKitPrebuilt.create(token);
    zp.joinRoom({
      container: this.root.nativeElement,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.protocol +'//'+
            window.location.host +
            window.location.pathname +
            '?roomID=' +
             this.roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });  }
}
