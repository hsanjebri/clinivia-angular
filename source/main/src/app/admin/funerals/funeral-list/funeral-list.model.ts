import { formatDate } from '@angular/common';
export class DepartmentList {
  id: number;
  idPatient:string;
  funeralServiceProvider: string;
  contactPersonForArrangement: string;
  contactPersonRelationshipToPatient: string;
  contactPersonPhoneNumber: string;
  estimatedFuneralExpenses: string;
  constructor(departmentList: DepartmentList) {
    {
      this.id = departmentList.id || this.getRandomID();
      this.idPatient=departmentList.idPatient||'';
      this.funeralServiceProvider = departmentList.funeralServiceProvider || '';
      this.contactPersonForArrangement = departmentList.contactPersonForArrangement || '';
      this.contactPersonRelationshipToPatient = departmentList.contactPersonRelationshipToPatient || '';
      this.contactPersonPhoneNumber = departmentList.contactPersonPhoneNumber || '';
      this.estimatedFuneralExpenses = departmentList.estimatedFuneralExpenses || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
