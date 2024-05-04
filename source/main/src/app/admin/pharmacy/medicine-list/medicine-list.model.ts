import { formatDate } from '@angular/common';
export class MedicineList {
  id: number;
  m_name: string;
  medDescription: string;
  medDosage: string;
  medForm: string;
  medPhoto: string;

  constructor(medicineList: MedicineList) {
    {
      this.id = medicineList.id ;
      this.m_name = medicineList.m_name || '';
      this.medDescription = medicineList.medDescription || '';
      this.medPhoto = medicineList.medPhoto || '';
      this.medDosage = medicineList.medDosage || '';
      this.medForm = medicineList.medForm || '';
    }
  }

}
