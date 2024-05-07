import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PatientService } from './patient.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Patient} from './patient.model';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { DeleteComponent } from './dialog/delete/delete.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import {formatDate, NgClass, DatePipe, CommonModule} from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {Router} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-allpatients',
  templateUrl: './allpatients.component.html',
  styleUrls: ['./allpatients.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    CommonModule,
    MatProgressBar,
  ],
})
export class AllpatientsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'select',
   //  'img',
     'email',
   //  'name',
   'gender',
   // 'address',
   //  'mobile',
   // 'date',
     'bgroupe',
   //  'treatment',
    'Progress',
   // 'patientContactEmergencies',
     //'medicalHistory',
     'patientAlergies',
    'actions',

  ];
  exampleDatabase?: PatientService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Patient>(true, []);
  index?: number;
  id?: number;
  patient?: Patient;
  patients: Patient[] = [];
  taskCompletionPercentages: { [key: number]: number } = {};
  private router: Router // Inject Router
  private readonly API_CALL = 'http://localhost:8085/Examen/makeCall';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public patientService: PatientService,
    private snackBar: MatSnackBar,
    private route:Router
  ) {
    super();
    this.router = route; // Assign route to router

  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  ngOnInit() {
    this.loadData(); // Make sure dataChange emits values
    this.exampleDatabase?.dataChange.subscribe(data => {
      if (data.length > 0) {
        this.loadTaskCompletionPercentages(); // Call loadTaskCompletionPercentages() after dataChange emits values
      }
    });
  }

  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        patient: this.patient,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {


        this.exampleDatabase?.dataChange.value.unshift(
          this.patientService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
    //this.route.navigate(["/","admin","patients","add-patient"]);
  }
  editCall(row: Patient) {
    this.id = row.idPatient;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        patient: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
       const dialogData = this.patientService.getDialogData();
       console.log(dialogData)
        this.patientService.updatePatient(dialogData);
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.idPatient === this.id
        );
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.patientService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            'Edit Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }
  // editCall(row: Patient) {
  //   this.id = row.idPatient;
  //   let tempDirection: Direction;
  //   if (localStorage.getItem('isRtl') === 'true') {
  //     tempDirection = 'rtl';
  //   } else {
  //     tempDirection = 'ltr';
  //   }
  //   const dialogRef = this.dialog.open(FormDialogComponent, {
  //     data: {
  //       departmentList: row,
  //       action: 'edit',
  //     },
  //     direction: tempDirection,
  //   });
  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 1) {
  //       // When using an edit things are little different, firstly we find record inside DataService by id
  //       const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
  //         (x) => x.idPatient === this.id
  //       );
  //       // Then you update that record using data from dialogData (values you enetered)
  //       if (foundIndex != null && this.exampleDatabase) {
  //         this.exampleDatabase.dataChange.value[foundIndex] =
  //           this.patientService.getDialogData();
  //         // And lastly refresh table
  //         this.refreshTable();
  //         this.showNotification(
  //           'black',
  //           'Edit Record Successfully...!!!',
  //           'bottom',
  //           'center'
  //         );
  //       }
  //     }
  //   });
  // }
  deleteItem(row: Patient) {
    this.id = row.idPatient;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.idPatient === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.patientService.deletePatient(row.idPatient);

          this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Delete Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.filteredData.findIndex(
        (d) => d === item
      );
      if (index !== -1) {
        this.dataSource.filteredData.splice(index, 1);
      }
      const dataIndex: number | undefined = this.exampleDatabase?.dataChange.value.findIndex(
        (d) => d === item
      );
      if (dataIndex !== undefined && dataIndex !== -1) {
        const patientId = this.exampleDatabase?.dataChange.value[dataIndex].idPatient;
        if (patientId !== undefined) {
          this.exampleDatabase?.dataChange.value.splice(dataIndex, 1);
          this.exampleDatabase?.deletePatient(patientId); // Call deletePatient with the ID
        }
      }
    });
    this.refreshTable();
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }

  public loadData() {
    this.exampleDatabase = new PatientService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter?.nativeElement.value;
      }
    );
  }
  loadTaskCompletionPercentages() {
    this.exampleDatabase?.dataChange.value.forEach(patient => {
      this.subs.sink = this.patientService.getTaskCompletionPercentage(patient.idPatient).subscribe(
        (percentage: number) => {
          this.taskCompletionPercentages[patient.idPatient] = percentage; // Store the percentage for the patient
        },
        (error) => {
          console.error('Error fetching task completion percentage:', error);
        }
      );
    });
  }

  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Name: x.name,
        Gender: x.gender,
        Address: x.address,
        'Birth Date': formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
        'Blood Group': x.bgroupe,
        Mobile: x.mobile,
        Treatment: x.treatment,
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }


  // assessNutritionalIntake(patientId: number): void {
  //   this.patientService.assessNutritionalIntake(patientId).subscribe(
  //     (assessmentResults: Map<Date, string>) => {
  //       // Handle assessment results, such as displaying them in a dialog or toast
  //       console.log(assessmentResults);
  //       this.snackBar.open('Nutritional intake assessed successfully!', 'Close', {
  //         duration: 3000
  //       });
  //     },
  //     (error) => {
  //       console.error('Error assessing nutritional intake:', error);
  //       this.snackBar.open('Error assessing nutritional intake!', 'Close', {
  //         duration: 3000
  //       });
  //     }
  //   );
  // }

  // assessNutritionalIntake(patientId: number): void {
  //   this.patientService.assessNutritionalIntake(patientId).subscribe(
  //     (assessmentResults: Map<Date, string>) => {
  //       // Navigate to NutritionComponent with assessment results as route data
  //       this.router.navigate(['/admin/patients/nutrition'], { state: { assessmentResults } });
  //     },
  //     (error) => {
  //       console.error('Error assessing nutritional intake:', error);
  //       this.snackBar.open('Error assessing nutritional intake!', 'Close', {
  //         duration: 3000,
  //       });
  //     }
  //   );
  // }
  redirectToNutrition(patientId: number) {
    this.router.navigate(['/admin/patients/nutrition', patientId]);
  }

  progressItem(patientId: number) {
    this.router.navigate(['/admin/patients/showprogress', patientId]);
  }

  makeCall() {
    // Make the API call here
    this.httpClient.get<any>(this.API_CALL).subscribe(
      (response) => {
        // Handle the response here, if needed
        console.log('API call response:', response);
        // You can perform any further actions here based on the response
      },
      (error) => {
        // Handle errors here
        console.error('Error making API call:', error);
        // You can also show a notification to the user about the error
        this.showNotification(
          'snackbar-danger',
          'Error making API call',
          'bottom',
          'center'
        );
      }
    );
  }

  taskr() {
    this.router.navigate(['/task']);

  }
}
export class ExampleDataSource extends DataSource<Patient> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Patient[] = [];
  renderedData: Patient[] = [];
  constructor(
    public exampleDatabase: PatientService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Patient[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllPatients();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((patient: Patient) => {
            const searchStr = (
              patient.name +
              patient.gender +
              patient.address +
              patient.date +
              patient.bgroupe +
              patient.treatment +
              patient.mobile
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() { }
  /** Returns a sorted copy of the database data. */
  sortData(data: Patient[]): Patient[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.idPatient, b.idPatient];
          break;
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'gender':
          [propertyA, propertyB] = [a.gender, b.gender];
          break;
        case 'address':
          [propertyA, propertyB] = [a.address, b.address];
          break;
        case 'mobile':
          [propertyA, propertyB] = [a.mobile, b.mobile];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
