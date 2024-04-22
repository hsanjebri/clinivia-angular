import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {NgxEchartsDirective, provideEcharts} from "ngx-echarts";
import { EChartsOption , } from "echarts";
import {Chart, registerables} from "chart.js";
import {PrescriptionService} from "./prescription.service";
import {Prescription} from "./prescription.model";
import{SigninComponent} from "../../authentication/signin/signin.component";
import {AuthService} from "@core";


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs ;
Chart.register(...registerables);

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
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
    NgxEchartsDirective,


  ],
  providers: [
    provideEcharts(),
  ]
})
export class PrescriptionsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'select',
    'title',
    'createdDate',
    'prescPhoto',
    'diseases',
    'patient email',
    //'medicamentList',
    'actions',
  ];
  exampleDatabase?: PrescriptionService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Prescription>(true, []);
  index?: number;
  id?: number;
  itemStockList?: Prescription;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public itemStockListService: PrescriptionService,
    private snackBar: MatSnackBar,
    private auth : AuthService

  ) {
    super();
  }

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  @ViewChild('filter2', { static: true }) filter2?: ElementRef;

  ngOnInit() {
    this.loadData();

  }

  generatePDF() {
    const prescriptions = this.dataSource.filteredData;

    // Create the PDF content dynamically
    const docDefinition = {
      content: [
        { text: 'Prescription Data', style: 'header' }, // Header

        {
          table: {
            body: [
              ['Title', 'Prescription Photo', 'Patient Email' , 'Created Date', 'Diseases', 'Description'], // Table header
              ...prescriptions.map(prescription => [
                prescription.title,
                prescription.emailPatient,
                prescription.prescPhoto,
                formatDate(new Date(prescription.createdDate), 'yyyy-MM-dd', 'en') || '',
                prescription.diseases,
                prescription.description,


              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 10], // Adjusted margin format (top, right, bottom, left)
        },
      },
    };

    // Generate and download the PDF
    // @ts-ignore
    pdfMake.createPdf(docDefinition).download('prescription_data.pdf');
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
        itemStockList: this.itemStockList,
        action: 'add',
        //doctor_id : this.comp.doctor_id ,


      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.itemStockListService.getDialogData()
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
  editCall(row: Prescription) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        itemStockList: row,
        action: 'edit',
        //doctor_id : this.comp.doctor_id ,
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)

        if (foundIndex != null && this.exampleDatabase ) {

          this.exampleDatabase.dataChange.value[foundIndex] =
            this.itemStockListService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            'Edit  Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }
  deleteItem(row: Prescription) {
    this.id = row.id;
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
          (x) => x.id === this.id
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
      this.selection = new SelectionModel<Prescription>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  public loadData() {
    this.exampleDatabase = new PrescriptionService(this.httpClient , this.auth);
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
    this.subs.sink = fromEvent(this.filter2?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter2 = this.filter2?.nativeElement.value;


      }
    );

  }





  exportExcel() {
    // Key names with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Title: x.title,
        Diseases: x.diseases,
        'Created Date': formatDate(new Date(x.createdDate), 'yyyy-MM-dd', 'en') || '',
        'Prescription Photo': x.prescPhoto,
        'Description': x.description,
        'Patient Email': x.emailPatient,
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
export class ExampleDataSource extends DataSource<Prescription> {
  filterChange = new BehaviorSubject('');
  filterChange2 = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  get filter2(): string {
    return this.filterChange2.value;
  }
  set filter2(filter: string) {
    this.filterChange2.next(filter);
  }
  filteredData: Prescription[] = [];
  renderedData: Prescription[] = [];
  constructor(
    public exampleDatabase: PrescriptionService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.filterChange2.subscribe(() => (this.paginator.pageIndex = 0));

  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Prescription[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getPrescriptionsByDoctorId();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        // Inside connect() method of ExampleDataSource class

        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((itemStockList: Prescription) => {
            const searchStr = (
              itemStockList.title +
              itemStockList.createdDate +
              itemStockList.diseases +
              itemStockList.prescPhoto+
              itemStockList.emailPatient
              // Add any other fields you want to search here
            ).toLowerCase();
            return (searchStr.indexOf(this.filter.toLowerCase()) !== -1 &&
              searchStr.indexOf(this.filter2.toLowerCase()) !== -1);
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
  sortData(data: Prescription[]): Prescription[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'title':
          [propertyA, propertyB] = [a.title, b.title];
          break;
        case 'createdDate':
          [propertyA, propertyB] = [a.createdDate, b.createdDate];
          break;
        case 'diseases':
          [propertyA, propertyB] = [a.diseases, b.diseases];
          break;
        case 'prescPhoto':
          [propertyA, propertyB] = [a.prescPhoto, b.prescPhoto];
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
