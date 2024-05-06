import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepartmentListService } from './vitalsign-list.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DepartmentList } from './vitalsign-list.model';
import { DataSource } from '@angular/cdk/collections';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialog/delete/delete.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate, NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './vitalsign-list.component.html',
  styleUrls: ['./vitalsign-list.component.scss'],
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
  ],
})
export class DepartmentListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'select',
    'bmi',
    'heigh',
    'weight',
    'recordingLocation',
    'heartRate',
    'bloodPressure',
    'respiratoryRate',
    'temperature',
    'oxygenSaturation',
    'actions',
  ];
  exampleDatabase?: DepartmentListService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<DepartmentList>(true, []);
  index!: number;
  id!: number;
  departmentList!: DepartmentList;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public departmentListService: DepartmentListService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  ngOnInit() {
    this.loadData();
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
        departmentList: this.departmentList,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.departmentListService.getDialogData()
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
  }
  editCall(row: DepartmentList) {
    this.id = row.vitalSignId;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        departmentList: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.vitalSignId === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.departmentListService.getDialogData();
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
  deleteItem(row: DepartmentList) {
    this.id = row.vitalSignId;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.vitalSignId === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);

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
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<DepartmentList>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  public loadData() {
    this.exampleDatabase = new DepartmentListService(this.httpClient);
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
  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        No: x.vitalSignId,
        'BMI ': x.bmi,
        'Height': x.heigh,
        'Weight ': x.weight,
        'Recording Location ': x.recordingLocation,
        'Heart Rate ': x.heartRate,
        'Blood Pressure ': x.bloodPressure,
        'Respiratory Rate ': x.respiratoryRate,
        'Temperature ': x.temperature,
        'Oxygen Saturation' : x.oxygenSaturation,
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
}
export class ExampleDataSource extends DataSource<DepartmentList> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: DepartmentList[] = [];
  renderedData: DepartmentList[] = [];
  constructor(
    public exampleDatabase: DepartmentListService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<DepartmentList[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllDepartmentLists();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((departmentList: DepartmentList) => {
            const searchStr = (
              departmentList.bmi+
              departmentList.heigh +
              departmentList.weight +
              departmentList.recordingLocation +
              departmentList.heartRate +
              departmentList.bloodPressure+
              departmentList.respiratoryRate+
              departmentList.temperature+
              departmentList.oxygenSaturation

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
  sortData(data: DepartmentList[]): DepartmentList[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'vitalSignId':
          [propertyA, propertyB] = [a.vitalSignId, b.vitalSignId];
          break;
          case 'bmi':
            [propertyA, propertyB] = [a.bmi, b.bmi];
            break;
        case 'heigh':
          [propertyA, propertyB] = [a.heigh, b.heigh];
          break;
        case 'weight':
          [propertyA, propertyB] = [a.weight, b.weight];
          break;
        case 'recordingLocation':
          [propertyA, propertyB] = [a.recordingLocation, b.recordingLocation];
          break;
        case 'heartRate':
          [propertyA, propertyB] = [a.heartRate, b.heartRate];
          break;
        case 'bloodPressure':
          [propertyA, propertyB] = [a.bloodPressure, b.bloodPressure];
          break;
        case 'respiratoryRate':
            [propertyA, propertyB] = [a.respiratoryRate, b.respiratoryRate];
            break;
        case 'temperature':
              [propertyA, propertyB] = [a.temperature, b.temperature];
              break;
        case 'oxygenSaturation':
                [propertyA, propertyB] = [a.oxygenSaturation, b.oxygenSaturation];
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
