import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import { PrescriptionService } from '../../GenPrescription.service';
import {FormGroup, FormBuilder, Validators, AbstractControl, FormArray, ReactiveFormsModule} from '@angular/forms';
import { Prescription } from '../../../prescription/prescription.model';
import { formatDate } from '@angular/common';
import { MedicineList } from "../../../../admin/pharmacy/medicine-list/medicine-list.model";
import { MedicineListService } from "../../../../admin/pharmacy/medicine-list/medicine-list.service";
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatCheckbox} from "@angular/material/checkbox";
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {Router} from "@angular/router";
import {Doctors} from "../../../../admin/doctors/alldoctors/doctors.model";
import {Patient} from "../../../../admin/patients/allpatients/patient.model";
import {AuthService} from "@core";

export interface DialogData {

  id: number;
  action: string;
  itemStockList: Prescription;
  doctor_id : number;
}

function validateurDate(minimumAge: number) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const dateActuelle = control.value;
    const minimumDate = new Date();

    if (dateActuelle > minimumDate) {
      return { dateMinimum: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-form-dialog:not(h)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  standalone: true,
  imports: [
    FileUploadComponent,
    MatError,
    MatIcon,
    MatFormField,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatCheckbox,
    ReactiveFormsModule,
    MatDialogClose,
    MatInputModule, // Ajoutez cette ligne pour importer MatInputModule
    CommonModule,
    FormsModule,


  ],

})
export class FormDialogComponent implements OnInit{
  action: string;
  dialogTitle: string;
  itemStockListForm:FormGroup = new  FormGroup({});
  itemStockList: Prescription;
  listMedicaments: MedicineList[] = [];
  minDate = new Date(); // La date d'aujourd'hui pour la sélection de la date minimale
  id_doctor! : number ;
  patient : Patient | undefined;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public prescriptionService: PrescriptionService,
    private medicineListService: MedicineListService,
    private formBuilder: FormBuilder,
    private  AuthService : AuthService


  ) {

    // Initialisation des valeurs
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.itemStockList.title;
      this.itemStockList = data.itemStockList;
    } else {
      this.dialogTitle = 'Nouvelle prescription';
      const objetVide = {} as Prescription;
      this.itemStockList = new Prescription(objetVide);
    }
    this.itemStockListForm = this.creerFormulaire();
  }
  ngOnInit() {
    this.id_doctor =this.AuthService.currentUserValue.id;
    this.itemStockListForm = this.formBuilder.group({
      id: [this.itemStockList.id],
      title: [this.itemStockList.title, [Validators.required]],
      diseases: [this.itemStockList.diseases, [Validators.required]],
      prescPhoto: [this.itemStockList.prescPhoto],
      createdDate: [
        formatDate(this.itemStockList.createdDate, 'yyyy-MM-dd', 'en'),
        [Validators.required, validateurDate(0)]
      ],
      emailPatient: [this.itemStockList.emailPatient, [Validators.required]],
      description: [this.itemStockList.description, [Validators.required]],
      medicines: this.formBuilder.array([], [Validators.required])

    });


    this.chargerMedicaments()
  }
  creerFormulaire(): FormGroup {
    return this.formBuilder.group({
      id: [this.itemStockList.id],
      title: [this.itemStockList.title, [Validators.required]],
      diseases: [this.itemStockList.diseases, [Validators.required]],
      prescPhoto: [this.itemStockList.prescPhoto],
      createdDate: [
        formatDate(this.itemStockList.createdDate, 'yyyy-MM-dd', 'en'),
        [Validators.required, validateurDate(0)]
      ],
      emailPatient: [this.itemStockList.emailPatient, [Validators.required]],
      description: [this.itemStockList.description, [Validators.required]],
      medicines: this.formBuilder.array([], [Validators.required])
    });
  }

  submit() {
    if (this.itemStockListForm.valid) {
      // Extract selected medicines
      const selectedMedicines = this.itemStockListForm.value.medicines
        .map((checked: boolean, index: number) => checked ? this.listMedicaments[index].id : null)
        .filter((medicine: MedicineList | null) => medicine !== null);


      const prescription: Prescription = {
        id: this.action === 'edit' ? this.data.itemStockList.id : 0, // Set ID if editing, otherwise 0
        title: this.itemStockListForm.value.title ,
        diseases: this.itemStockListForm.value.diseases,
        prescPhoto: this.itemStockListForm.value.prescPhoto,
        createdDate: this.itemStockListForm.value.createdDate,
        emailPatient: this.itemStockListForm.value.emailPatient,
        description: this.itemStockListForm.value.description,
        doctor_id : this.id_doctor,
        medicines: [], // Empty for now, will be populated after prescription creation
        approved: true,
        symptoms : this.itemStockList.symptoms,
        ppatient_id : this.itemStockList.ppatient_id,
        suggestedMedicines : this.itemStockList.suggestedMedicines,
        doctor_name : ""
      };
      prescription.doctor_id = this.id_doctor
      if (this.action === 'edit') {

        // If editing, update the prescription
        this.prescriptionService.updateItemStockList( prescription).subscribe(() => {
          this.prescriptionService.addMedicinesToPrescription(prescription.id, new Set(selectedMedicines)).subscribe(() => {
            this.dialogRef.close(1); // Close the dialog with a success flag
          });
        });
      } else {

        // If adding, create a new prescription
        this.prescriptionService.addItemStockList(prescription).subscribe((createdPrescription: Prescription) => {
          this.prescriptionService.addMedicinesToPrescription(createdPrescription.id, new Set(selectedMedicines)).subscribe(() => {
            this.dialogRef.close(1); // Close the dialog with a success flag
          });
        });
      }
    } else {
      this.markFormGroupTouched(this.itemStockListForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    (Object as any).values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmAdd(): void {
    this.prescriptionService.addItemStockList(this.itemStockListForm.getRawValue());
  }

  chargerMedicaments(): void {
    this.medicineListService.getAllMedicineLists().subscribe((medicaments: MedicineList[]) => {
      this.listMedicaments = medicaments;
      this.ajouterCasesAcocher();
    });
  }

  ajouterCasesAcocher() {
    this.listMedicaments.forEach(() =>
      this.medicin.push(this.formBuilder.control(false))); // Créez un FormControl pour chaque médicament

  }
  get medicin (){
    return this.itemStockListForm.get('medicines')as FormArray;
  }
}
