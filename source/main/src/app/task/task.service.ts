import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Task } from './task.model';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_BASE_URL = 'http://localhost:8085/Examen/tasks';
  private readonly API_URL_GET_ALL = `${this.API_BASE_URL}/getAll`;
  private readonly API_URL_ADD = `${this.API_BASE_URL}/add`;
  private readonly API_URL_UPDATE = `${this.API_BASE_URL}/update`;
  private readonly API_URL_DELETE = `${this.API_BASE_URL}/delete/`;

  private tasks: Task[] = [];
  tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor(private httpClient: HttpClient,private toastr: ToastrService) {

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

  updateTask(task: Task): void {
    this.httpClient.put<Task>(this.API_URL_UPDATE, task).subscribe({
      next: (data) => {
        const index = this.tasks.findIndex(t => t.idTask === task.idTask);
        if (index !== -1) {
          this.tasks[index] = data;
          this.tasksSubject.next(this.tasks);
          this.toastr.info('Task updated successfully!', 'Success');

        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating task:', error);
      }
    });
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
}
