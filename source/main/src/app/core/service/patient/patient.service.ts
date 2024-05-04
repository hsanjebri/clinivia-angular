import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Patient} from "@core/models/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private  http:HttpClient) {


  }

  getpatients(){
    return this.http.get<Patient[]>('http://localhost:8081/patients/getall')
  }
}
