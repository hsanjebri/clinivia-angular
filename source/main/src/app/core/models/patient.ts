export interface Patient {
  idPatient: number;
  name: string;
  patientPassword: string;
  date: Date;
  address: string;
  bGroup: string;
  gender: Gender;
  mobile: string;
  patientContactEmergencies: string;
  medicalHistory: string;
  patientAlergies: Alergie;
  treatment: string;
  image: string;
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum Alergie {
  PEANUTS = "Peanuts",
  GLUTEN = "Gluten",
  DAIRY = "Dairy"
}

export interface Funeral {
}

export interface Payment {
}

export interface Service {
}
