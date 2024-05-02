import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SubscriptionServiceService } from '../../subscription.service';
import { Observable } from 'rxjs';
import { subscription } from '../../subscriptionModel';
import { CommonModule, DatePipe, Location, NgClass } from '@angular/common';
import { Direction } from '@angular/cdk/bidi';
import { MatDialog } from '@angular/material/dialog';
import { EditFormComponent } from './Dialog/edit-form/edit-form.component';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExampleDataSource } from 'app/contacts/contacts.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-all-subscriptions',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatPaginatorModule,
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
  templateUrl: './all-subscriptions.component.html',
  styleUrl: './all-subscriptions.component.scss'
})
export class AllSubscriptionsComponent extends UnsubscribeOnDestroyAdapter {
  listSubscriptions: subscription[] =[];
  id?: number;
  exampleDatabase?: SubscriptionServiceService;
  dataSource!: ExampleDataSource;
  //@ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  
  constructor(private ss: SubscriptionServiceService,public dialog: MatDialog, private snackBar: MatSnackBar, private location: Location){
    super();
  }

 

  ngOnInit() {
    this.ss.getAllSub().subscribe({
      next:(data)=>data.forEach(sub=>{
        if(sub.byadmin == true)
          this.listSubscriptions.push(sub)
      }),
    }) 
  }

  editCall(row: subscription) {
    this.id = row.subscriptionID;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(EditFormComponent, {
      data: {
        subscription: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.subscriptionID === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.ss.getDialogData();
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

  private refreshTable() {
    
    this.paginator?._changePageSize(this.paginator?.pageSize);
    
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
