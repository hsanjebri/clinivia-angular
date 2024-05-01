  import { Injectable } from '@angular/core';
  import {BehaviorSubject, Observable} from 'rxjs';
  import { Room } from './room.model';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { UnsubscribeOnDestroyAdapter } from '@shared';

  @Injectable({
    providedIn: 'root',
  })

  export class RoomService extends UnsubscribeOnDestroyAdapter {
    private readonly API_URL = 'http://localhost:8081/Examen/dietplan/getall';
    private readonly API_URLADD = 'http://localhost:8081/Examen/dietplan/add'; // Remove {id} placeholder
    private readonly API_URLdelete = 'http://localhost:8081/Examen/dietplan/delete/'; // Remove {id} placeholder
    private readonly API_UPDATE = 'http://localhost:8081/Examen/dietplan/update';
    private readonly API_ASSESS_INTAKE = 'http://localhost:8081/Examen/dietplan/assess/'; // Replace with your actual URL

    isTblLoading = true;
    dataChange: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);
    // Temporarily stores data from dialogs
    dialogData!: Room;
    constructor(private httpClient: HttpClient) {
      super();
    }
    get data(): Room[] {
      return this.dataChange.value;
    }
    getDialogData() {
      return this.dialogData;
    }
    /** CRUD METHODS */
    getAllRooms(): void {
      this.subs.sink = this.httpClient.get<Room[]>(this.API_URL).subscribe({
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
    addRoom(room: Room): void {
      this.httpClient.post<Room>(this.API_URLADD, room)
        .subscribe({
          next: (data) => {
            this.dialogData = room;
            this.dataChange.value.push(data);
            this.dataChange.next(this.dataChange.value);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error adding patient:', error);
          },
        });
    }
    // updateRoom(room: Room): void {
    //   this.httpClient.put<Room>(this.API_UPDATE, room)
    //     .subscribe({
    //       next: (data) => {
    //         const index = this.dataChange.value.findIndex((x) => x.idDiet === room.idDiet);
    //         if (index !== null) {
    //           // Update the existing object in the data source
    //           this.dataChange.value[index] = room;
    //           // Refresh the table to reflect the changes
    //          // this.refreshTable();
    //           console.log('Patient updated successfully:', data);
    //         }
    //       },
    //       error: (error: HttpErrorResponse) => {
    //         console.error('Error updating patient:', error);
    //       },
    //     });
    // }
    deleteRoom(id: number): void {
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
