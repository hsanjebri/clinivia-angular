import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {PrescriptionService} from "../../doctor/prescription/prescription.service";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {Prescription} from "../../doctor/prescription/prescription.model";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {SigninComponent} from "../../authentication/signin/signin.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {formatDate} from "@angular/common";
import * as pdfMake from "pdfmake/build/pdfmake";
import {Direction} from "@angular/cdk/bidi";
import {FormDialogComponent} from "../../doctor/prescription/dialog/form-dialog/form-dialog.component";
import {DeleteDialogComponent} from "../../doctor/prescription/dialog/delete/delete.component";
import {BehaviorSubject, fromEvent, merge, Observable} from "rxjs";
import {map} from "rxjs/operators";
// @ts-ignore
import {constructor} from "apexcharts";

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatIconModule,
  ],
})
export class PrescriptionsComponent {
  /** extends UnsubscribeOnDestroyAdapter
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
    public  comp :SigninComponent
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

  generatePDF(){
    const myData = this.dataSource.filteredData;

// Create the PDF content dynamically
    const docDefinition = {
      content: [
        { text: 'My presctiption Data', style: 'header' }, // Header
        {
          table: {
            body: [
              ['TITLE', 'MEDLIST', 'createddate'], // Table header
              ...myData.map(item => [
                item.title,
                // item.medicamentList,
                formatDate(new Date(item.createdDate), 'yyyy-MM-dd', 'en') || '',

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

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

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
    this.exampleDatabase = new PrescriptionService(this.httpClient);
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



  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        title: x.title,
        Diseases: x.diseases,
        // med: x.medicamentList,
        'Purchase Date': formatDate(new Date(x.createdDate), 'yyyy-MM-dd', 'en') || '',

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

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
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
  }

  connect(): Observable<Prescription[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllItemStockLists();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((itemStockList: Prescription) => {
            const searchStr = (
              itemStockList.title +
              itemStockList.createdDate +
              itemStockList.diseases +
              itemStockList.prescPhoto

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
  disconnect() {
  }

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
**/
}constructor()

