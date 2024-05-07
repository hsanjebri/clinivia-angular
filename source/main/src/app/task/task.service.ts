import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import { Task } from './task.model';
import {ToastrService} from "ngx-toastr";
import {AuthService} from "@core";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_BASE_URL = 'http://localhost:8085/Examen/tasks';
  private readonly API_URL_GET_ALL = `${this.API_BASE_URL}/getAll`;
  private readonly API_URL_ADD = `${this.API_BASE_URL}/add`;
  private readonly API_URL_UPDATE = `${this.API_BASE_URL}/update`;
  private readonly API_URL_DELETE = `${this.API_BASE_URL}/delete/`;
  private readonly API_URL_GET_BY_PATIENT = `${this.API_BASE_URL}/by-patient/`; // New URL for get by patient
  idPatient ! : number | undefined;
  auth : AuthService | undefined
  private tasks: Task[] = [];
  tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  isTblLoading = true;
  private subs = new Subscription(); // Added to manage subscriptions

  constructor(private httpClient: HttpClient,private toastr: ToastrService,private authService: AuthService ) {

  }

  getAllTasks(): void {
    this.httpClient.get<Task[]>(this.API_URL_GET_ALL).subscribe({
      next: (data) => {
        this.tasks = data;
        this.tasksSubject.next(this.tasks);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  addTask(task: Task): void {
    this.httpClient.post<Task>(this.API_URL_ADD, task).subscribe({
      next: (data) => {
        this.tasks.push(data);
        this.tasksSubject.next(this.tasks);
        this.toastr.success('Task added!', 'New Task'); // Display success message

      },

      error: (error: HttpErrorResponse) => {
        console.error('Error adding task:', error);
      }
    });
  }

  updateTask(task: Task): Observable<any> {
    return this.httpClient.put<Task>(this.API_URL_UPDATE, task);
  }

  deleteTask(taskId: string): void {
    this.httpClient.delete(`${this.API_URL_DELETE}${taskId}`).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.idTask !== taskId);
        this.tasksSubject.next(this.tasks);
        this.toastr.error('Task deleted successfully!', 'Success');

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  getTasks(): BehaviorSubject<Task[]> {
    return this.tasksSubject;
  }



  // getTasksByPatientId(patientId: number): Observable<Task[]> {
  //   return this.httpClient.get<Task[]>(`${this.API_URL_GET_BY_PATIENT}${patientId}`);
  // }


  // public getTasksByPatientId(): void {
  //   this.idPatient = this.authService.currentUserValue.id;
  //
  //   this.subs = this.httpClient.get<Task[]>(`${this.API_URL_GET_BY_PATIENT}${this.idPatient}`)
  //     .subscribe({
  //       next: (data: Task[]) => {
  //         this.isTblLoading = false;
  //         this.tasksSubject.next(data); // Update with fetched tasks
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         console.error(error.name + ' ' + error.message);
  //         // Handle error (e.g., display message, retry)
  //       }
  //     });
  // }
  public getTasksByPatientId(): Observable<Task[]> {
    this.idPatient = this.authService.currentUserValue.id;
    return this.httpClient.get<Task[]>(`${this.API_URL_GET_BY_PATIENT}${this.idPatient}`);
  }

}
