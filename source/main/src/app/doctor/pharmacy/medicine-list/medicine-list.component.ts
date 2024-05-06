import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
//import *as pdfMake from 'pdfmake/build/pdfmake';//ajouter ceci aussi 
//import *as pdfMake from 'pdfmake/build/pdfmake';//ajouter ceci aussi
//import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import *as PdfFonts from 'pdfmake/build/vfs_fonts'; 
import { MedicineListService } from './medicine-list.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MedicineList } from './medicine-list.model';
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
(pdfMake as any).vfs =PdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss'],
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
export class MedicineListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'select',
    'mno',
    'mname',
    'category',
    'company',
    'pdate',
    'price',
    'edate',
    'stock',
    'actions',
  ];
  exampleDatabase?: MedicineListService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<MedicineList>(true, []);
  index?: number;
  id?: number;
  medicineList?: MedicineList;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public medicineListService: MedicineListService,
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
        medicineList: this.medicineList,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.medicineListService.getDialogData()
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
  editCall(row: MedicineList) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        medicineList: row,
        action: 'edit',
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
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.medicineListService.getDialogData();
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
  deleteItem(row: MedicineList) {
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
      this.selection = new SelectionModel<MedicineList>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  public loadData() {
    this.exampleDatabase = new MedicineListService(this.httpClient);
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
        No: x.mno,
        'Medicine Name': x.mname,
        Category: x.category,
        'Purchase Date':
          formatDate(new Date(x.pdate), 'yyyy-MM-dd', 'en') || '',
        'Company Name': x.company,
        Price: x.price,
        'Expired Date':
          formatDate(new Date(x.edate), 'yyyy-MM-dd', 'en') || '',
        Stock: x.stock,
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
  generatePDF() {
    const content: any[] = this.dataSource.filteredData.map((medicine) => [
      { text: 'Medicine Name:', style: 'subheader' }, medicine.mname,
      { text: 'Category:', style: 'subheader' }, medicine.category,
      { text: 'Purchase Date:', style: 'subheader' }, medicine.pdate,
      { text: 'Company Name:', style: 'subheader' }, medicine.company,
      { text: 'Price:', style: 'subheader' }, medicine.price,
      { text: 'Expired Date:', style: 'subheader' }, medicine.edate,
      { text: 'Stock:', style: 'subheader' }, medicine.stock,
      { text: '\n' }, // Add empty line between medicines
    ]);

    const docDefinition = {
      content: [
        { text: 'Complaint List', style: 'header' },
        { text: new Date().toLocaleDateString(), alignment: 'right' }, // Current date
        { text: '\n\n' }, // Add spaces between title and content
        ...content, // Add content to the PDF
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },
      },
    };

    pdfMake.createPdf(docDefinition).open(); // Open the PDF in a new tab
  }
  /*getTotalMedicineCount(): number {
    return this.dataSource.filteredData.length;
  }*/
 /* calculateMedicineList() {
    const medicineList = this.getMedicineList();
    alert(`Liste de médicaments : ${medicineList}`);
  }
  
  getMedicineList(): string {
    // Vous pouvez formater la liste de médicaments comme vous le souhaitez
    // Par exemple, vous pouvez simplement concaténer les noms des médicaments
    // Ou vous pouvez formater la liste de médicaments d'une manière plus structurée
    
    // Ici, je vais simplement récupérer les noms des médicaments pour les afficher dans une alerte
    const medicineNames = this.dataSource.filteredData.map(medicine => medicine.mname).join(', ');
    return medicineNames;
  }*/
  calculateMedicineList() {
    const medicineList = this.getMedicineList();
    const totalMedicineCount = this.getTotalMedicineCount();
    alert(`Liste de complaints (${totalMedicineCount} au total) : ${medicineList}`);
  }
  
  getMedicineList(): string {
    const medicineNames = this.dataSource.filteredData.map(medicine => medicine.mname).join(', ');
    return medicineNames;
  }
  
  getTotalMedicineCount(): number {
    return this.dataSource.filteredData.length;
  }

  public loadDataByCategory() {
    this.exampleDatabase = new MedicineListService(this.httpClient);
    // Utilisez la méthode mise à jour pour charger les données triées
    this.exampleDatabase.getAllMedicineListsByCategory();
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
  

  
}
 

export class ExampleDataSource extends DataSource<MedicineList> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: MedicineList[] = [];
  renderedData: MedicineList[] = [];
  constructor(
    public exampleDatabase: MedicineListService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<MedicineList[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllMedicineLists();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((medicineList: MedicineList) => {
            const searchStr = (
              medicineList.mno +
              medicineList.mname +
              medicineList.category +
              medicineList.company +
              medicineList.pdate +
              medicineList.price +
              medicineList.edate +
              medicineList.stock
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
  sortData(data: MedicineList[]): MedicineList[] {
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
        case 'mno':
          [propertyA, propertyB] = [a.mno, b.mno];
          break;
        case 'mname':
          [propertyA, propertyB] = [a.mname, b.mname];
          break;
        case 'category':
          [propertyA, propertyB] = [a.category, b.category];
          break;
        case 'company':
          [propertyA, propertyB] = [a.company, b.company];
          break;
        /*case 'pdate':
          [propertyA, propertyB] = [a.pdate, b.pdate];
          break;*/
          case 'pdate':
            // Convertir les dates en timestamps pour la comparaison
            [propertyA, propertyB] = [new Date(a.pdate).getTime(), new Date(b.pdate).getTime()];
            break; 
        case 'price':
          [propertyA, propertyB] = [a.price, b.price];
          break;
       /* case 'edate':
          [propertyA, propertyB] = [a.edate, b.edate];
          break;*/
          case 'edate':
            // Convertir les dates en timestamps pour la comparaison
            [propertyA, propertyB] = [new Date(a.edate).getTime(), new Date(b.edate).getTime()];
            break; 
        case 'stock':
          [propertyA, propertyB] = [a.stock, b.stock];
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
