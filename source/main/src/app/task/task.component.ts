  import {HttpClient, HttpErrorResponse} from '@angular/common/http';
  import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
  import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators, AbstractControl
  } from '@angular/forms';
  import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
  import { Task } from './task.model';
  import { NgClass, DatePipe } from '@angular/common';
  import { NgScrollbar } from 'ngx-scrollbar';
  import { MatDatepickerModule } from '@angular/material/datepicker';
  import { MatOptionModule } from '@angular/material/core';
  import { MatSelectModule } from '@angular/material/select';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { MatInputModule } from '@angular/material/input';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatIconModule } from '@angular/material/icon';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatButtonModule } from '@angular/material/button';
  import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
  import {TaskService} from "./task.service";
  import {Component} from "@angular/core";

  @Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    standalone: true,
    imports: [
      BreadcrumbComponent,
      MatButtonModule,
      MatSidenavModule,
      MatTooltipModule,
      MatIconModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      MatSelectModule,
      MatOptionModule,
      MatDatepickerModule,
      NgScrollbar,
      CdkDropList,
      CdkDrag,
      CdkDragHandle,
      CdkDragPlaceholder,
      NgClass,
      DatePipe,

    ],
  })
  export class TaskComponent {
    mode = new UntypedFormControl('side');
    taskForm: UntypedFormGroup;
    showFiller = false;
    isNewEvent = false;
    dialogTitle?: string;
    userImg?: string;
    tasks: Task[] = [];
    minDate: Date;

    private readonly API_URL = 'http://localhost:8085/Examen/tasks/getall';

    constructor(private fb: UntypedFormBuilder, private http: HttpClient, private taskService: TaskService) {
      this.taskForm = this.fb.group({
        title: ['', Validators.required],
        done: [false],
        priority: ['Low'],
        due_date: ['', [Validators.required, this.dateValidator()]], // Ajout du contrôle de date
        note: ['']
      });

      // Set minimum date to today
      this.minDate = new Date();
      this.fetch((data: Task[]) => {
        this.tasks = data;
      });
    }
    dateValidator() {
      return (control: AbstractControl) => {
        const selectedDate = new Date(control.value);
        if (selectedDate < this.minDate) {
          return { invalidDate: true };
        }
        return null;
      };
    }
    fetch(cb: (i: Task[]) => void) {
      this.http.get<Task[]>(this.API_URL).subscribe({
        next: (data) => {
          console.log(data);
          cb(data);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching tasks:', error);
        }
      });
  }
    drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    }
    toggle(task: { done: boolean }, nav: MatSidenav) {
      nav.close();
      task.done = !task.done;
    }
    addNewTask(nav: MatSidenav) {
      this.resetFormField();
      this.isNewEvent = true;
      this.dialogTitle = 'New Task';
      this.userImg = 'assets/images/user/user1.jpg';
      nav.open();

    }
    taskClick(task: Task, nav: MatSidenav): void {
      this.isNewEvent = false;
      this.dialogTitle = 'Edit Task';
      this.userImg = task.img;
      nav.open();
      this.taskForm = this.createFormGroup(task);
    }
    closeSlider(nav: MatSidenav) {
      nav.close();
    }
    createFormGroup(data: Task) {
      return this.fb.group({
        idTask: [data ? data.idTask : this.getRandomID()],
        img: [data ? data.img : 'assets/images/user/user1.jpg'],
        title: [data ? data.title : null],
        done: [data ? data.done : null],
        priority: [data ? data.priority : null],
        due_date: [data ? data.due_date : null],
        note: [data ? data.note : null],
      });
    }
    saveTask() {
      this.tasks.unshift(this.taskForm.value);
      console.log("adding");
      const newTask = this.taskForm.value;
      this.taskService.addTask(newTask);
      this.resetFormField();

    }
    editTask(): void {
      const editedTask = this.taskForm.value;

      console.log("task body",editedTask);

      const targetIdx = this.tasks.findIndex(item => item.idTask === editedTask.idTask);
      if (targetIdx !== -1) {
        this.tasks[targetIdx] = editedTask;
       // Update the task object directly
      }

        console.log("editing");
        this.taskService.updateTask(editedTask).subscribe(() => {
          console.log("edited");
        });


    }


    deleteTask(nav: MatSidenav) {
      const taskIdToDelete = this.taskForm.value.idTask;
      this.taskService.deleteTask(taskIdToDelete);
      const targetIdx = this.tasks
        .map((item) => item.idTask)
        .indexOf(this.taskForm.value.idTask);
      this.tasks.splice(targetIdx, 1);
      nav.close();
    }
    resetFormField() {
      this.taskForm.controls['title'].reset();
      this.taskForm.controls['done'].reset();
      this.taskForm.controls['priority'].reset();
      this.taskForm.controls['due_date'].reset();
      this.taskForm.controls['note'].reset();
    }
    public getRandomID(): string {
      const S4 = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return S4() + S4();
    }
  }
