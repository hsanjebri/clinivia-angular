import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ItemStockListService } from './item-stock-list.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ItemStockList } from './item-stock-list.model';
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
//import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {NgxEchartsDirective, provideEcharts} from "ngx-echarts";
import { EChartsOption , } from "echarts";
import {Chart, registerables} from "chart.js";
//(pdfMake as any).vfs = pdfFonts.pdfMake.vfs ;
//Chart.register(...registerables);
(pdfMake as any).vfs =pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-item-stock-list',
  templateUrl: './item-stock-list.component.html',
  styleUrls: ['./item-stock-list.component.scss'],
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
export class ItemStockListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'select',
    'i_name',
    'category',
    'qty',
    'date',
    'price',
    'details',
    'actions',
  ];
  exampleDatabase?: ItemStockListService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<ItemStockList>(true, []);
  index?: number;
  id?: number;
  itemStockList?: ItemStockList;


  pieChartData: EChartsOption = {};
  categories : string[] =[];
  items_by_category : number[]=[];


  chartdata:any[]=[];
  categorydata :any[]=[];
  countdata :any[]=[];
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public itemStockListService: ItemStockListService,
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
   /* this.itemStockListService.Items().subscribe(result => {this.categorydata =result;
if(this.categorydata!=null){
  for(let i=0 ; i<this.categorydata.length ; i++){
    console.log(this.chartdata[i]);
  }
}

  });*/


  }




  generatePDF(){
     const myData = this.dataSource.filteredData;

// Create the PDF content dynamically
     const docDefinition = {
       content: [
         { text: 'My inventory Data', style: 'header' }, // Header
         {
           table: {
             body: [
               ['Item Name', 'Category', 'Quantity', 'Purchase Date', 'Price', 'Details'], // Table header
               ...myData.map(item => [
                 item.i_name,
                 item.category,
                 item.qty,
                 formatDate(new Date(item.date), 'yyyy-MM-dd', 'en') || '',
                 item.price,
                 item.details,
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
     pdfMake.createPdf(docDefinition).download('invenotry_data.pdf');

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
  editCall(row: ItemStockList) {
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
        // if ( this.exampleDatabase.dataChange.value[foundIndex].qty <3 )

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
  deleteItem(row: ItemStockList) {
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
      this.selection = new SelectionModel<ItemStockList>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }
  public loadData() {
    this.exampleDatabase = new ItemStockListService(this.httpClient);
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

  // area line chart
  area_line_chart: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['owned', 'Pre-order', 'out-off-service'],
      textStyle: {
        color: '#9aa0ac',
        padding: [0, 5, 0, 5],
      },
    },
    toolbox: {
      show: !0,
      feature: {
        magicType: {
          show: !0,
          title: {
            line: 'Line',
            bar: 'Bar',
            stack: 'Stack',
          },
          type: ['line', 'bar', 'stack'],
        },
        restore: {
          show: !0,
          title: 'Restore',
        },
        saveAsImage: {
          show: !0,
          title: 'Save Image',
        },
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: !1,
        data: ['oiijoij', 'string', 'aa', 'Diagnostic Tools','Protective Gear'],
        axisLabel: {
          fontSize: 10,
          color: '#9aa0ac',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          fontSize: 10,
          color: '#9aa0ac',
        },
      },
    ],
    series: [
      {
        name: 'number',
        type: 'line',
        smooth: !0,
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [77, 96, 79, 21, 73],
      },
      {
        name: 'price',
        type: 'line',
        smooth: !0,
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [78, 50, 130, 100, 20],
      },
      {
        name: 'category',
        type: 'line',
        smooth: !0,
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [10, 20, 50, 10, 20,],
      },
    ],
    color: ['#9f78ff', '#fa626b', '#32cafe'],
  };
  // export table data in excel file
  pie_chart2:  EChartsOption = {
    legend: {
      top: 'bottom',
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: 'Chart equipment',
        type: 'pie',
        radius: '55%',
        center: ['50%', '48%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 24, name: 'noionuio' },
          { value: 18, name: 'aaa' },
          { value: 35, name: 'string' },
          { value: 16, name: 'Stethoscope' },
          { value: 12, name: 'blood presure monitor' },
          { value: 34, name: 'Gloves' },
          { value: 39, name: 'Mask surgical' },





        ],
      },
    ],
  };

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        'Item Name': x.i_name,
        Category: x.category,
        Quantity: x.qty,
        'Purchase Date': formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
        Price: x.price,
        Details: x.details,
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
export class ExampleDataSource extends DataSource<ItemStockList> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: ItemStockList[] = [];
  renderedData: ItemStockList[] = [];
  constructor(
    public exampleDatabase: ItemStockListService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ItemStockList[]> {
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
          .filter((itemStockList: ItemStockList) => {
            const searchStr = (
              itemStockList.i_name +
              itemStockList.category +
              itemStockList.qty +
              itemStockList.date +
              itemStockList.price +
              itemStockList.details
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
  sortData(data: ItemStockList[]): ItemStockList[] {
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
        case 'i_name':
          [propertyA, propertyB] = [a.i_name, b.i_name];
          break;
        case 'category':
          [propertyA, propertyB] = [a.category, b.category];
          break;
        case 'qty':
          [propertyA, propertyB] = [a.qty, b.qty];
          break;
        case 'date':
          [propertyA, propertyB] = [a.date, b.date];
          break;
        case 'price':
          [propertyA, propertyB] = [a.price, b.price];
          break;
        case 'details':
          [propertyA, propertyB] = [a.details, b.details];
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
