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
  description : string ;
  medicines :  MedicineList[];
  approved : boolean;
  symptoms : string;
  doctor_id: number;
  ppatient_id: number;
  suggestedMedicines : string;
  doctor_name : string
  constructor(prescription: Prescription) {
    {
      this.id = prescription.id ;
      this.medicines = prescription.medicines;
      this.approved = true;
      this.suggestedMedicines = prescription.suggestedMedicines || '';
      this.description = prescription.description || '';
      this.emailPatient = prescription.emailPatient || '';
      this.title = prescription.title || '';
      this.symptoms = prescription.symptoms || '';
      this.prescPhoto = prescription.prescPhoto || '';
      this.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
     this.doctor_id = prescription.doctor_id ;
      this.ppatient_id = prescription.ppatient_id ;
      this.diseases = prescription.diseases || '';
      this.doctor_name = prescription.doctor_name || '';



    }
  }

}
