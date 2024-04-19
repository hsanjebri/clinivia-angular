import { Role } from "@core";

export class Patient {
  id: number;
  img: string;
  name: string;
  gender: string;
  bGroup: string;
  date: string;
  address: string;
  mobile: string;
  treatment: string;
  role: string;
  password: string;
  email: string;
  constructor(patient: Patient) {
    {
      this.id = patient.id || this.getRandomID();
      this.img = patient.img || 'assets/images/user/user1.jpg';
      this.name = patient.name || '';
      this.gender = patient.gender || 'male';
      this.bGroup = patient.bGroup || '';
      this.date = patient.date || '';
      this.address = patient.address || '';
      this.mobile = patient.mobile || '';
      this.treatment = patient.treatment || '';
      this.email = patient.email || '';
      this.role = Role.Patient;
      this.password = patient.password || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
