import { formatDate } from '@angular/common';
import {Doctors} from "../../admin/doctors/alldoctors/doctors.model";
import {Patient} from "../../admin/patients/allpatients/patient.model";
import {MedicineList} from "../../admin/pharmacy/medicine-list/medicine-list.model";
export class Prescription {
  id: number;
  title: string;
  prescPhoto: string;
  createdDate: string;
  diseases: string;
  emailPatient : string ;

  Allmedicines:  MedicineList[];
  medicines :  MedicineList[];

  doctor: Doctors;
  patient : Patient;
  constructor(prescription: Prescription) {
    {
      this.id = prescription.id ;


      this.Allmedicines = prescription.Allmedicines ;
      this.medicines = prescription.medicines;


      this.emailPatient = prescription.emailPatient || '';
      this.title = prescription.title || '';
      this.prescPhoto = prescription.prescPhoto || '';
      this.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.doctor = prescription.doctor ;
      this.diseases = prescription.diseases || '';
      this.patient = prescription.patient ;


    }
  }

}
