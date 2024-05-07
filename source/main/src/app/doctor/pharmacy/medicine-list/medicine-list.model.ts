import { formatDate } from '@angular/common';
export class MedicineList {
  id: number;
  mno: string;
  mname: string;
  category: string;
  company: string;
  pdate: Date;
  price: string;
  edate: Date;
  stock: string;
  ///j'ajoute et je supprime 
  //Service : string;
  //Prix :number;
  constructor(medicineList: MedicineList) {
    {
      this.id = medicineList.id || this.getRandomID();
      this.mno = medicineList.mno || '';
      this.mname = medicineList.mname || '';
      this.category = medicineList.category || '';
      this.company = medicineList.company || '';
      /*this.pdate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';*/
      this.pdate = medicineList.pdate ? new Date(medicineList.pdate) : new Date();
      this.price = medicineList.price || '';
      /*this.edate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';*/
      this.edate = medicineList.edate ? new Date(medicineList.edate) : new Date();
      this.stock = medicineList.stock || '';
     


    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
