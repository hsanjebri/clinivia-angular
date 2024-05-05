import { formatDate } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DepartmentListComponent } from './department-list.component';//
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';  // Assurez-vous d'importer le composant BreadcrumbComponent
import { MatIconModule } from '@angular/material/icon';
import { DepartmentListComponent } from './department-list.component';
@NgModule({
//  declarations: [DepartmentListComponent],//
  imports: [
    CommonModule,
    MatIconModule, // Ajoutez MatIconModule dans les imports
  ],
})
export class DepartmentList {
  id: number;
  dno: string;
  dname: string;
  description: string;
 /** d_date: string;*/
  ddate: Date;
  dhead: string;
  status: string;
  constructor(departmentList: DepartmentList) {
    {
      this.id = departmentList.id || this.getRandomID();
      this.dno = departmentList.dno || '';
      this.dname = departmentList.dname || '';
      this.description = departmentList.description || '';
      /**this.d_date = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';*/
      this.ddate = departmentList.ddate ? new Date(departmentList.ddate) : new Date();
      this.dhead = departmentList.dhead || '';
      this.status = departmentList.status || 'Active';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
