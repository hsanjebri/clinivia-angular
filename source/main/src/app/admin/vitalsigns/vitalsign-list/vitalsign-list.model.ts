import { formatDate } from '@angular/common';
export class DepartmentList {
  vitalSignId: number;
  bmi:number;
  heigh: number;
  weight: number;
  recordingLocation: string;
  heartRate: number ;
  bloodPressure: string;
  respiratoryRate:number;
  temperature:number;
  oxygenSaturation:number;
  constructor(departmentList: DepartmentList) {
    {
      this.vitalSignId = departmentList.vitalSignId || this.getRandomID();
      this.bmi=departmentList.bmi||0;
      this.heigh = departmentList.heigh ||0;
      this.weight = departmentList.weight ||0;
      this.recordingLocation = departmentList.recordingLocation || '';
      this.heartRate = departmentList.heartRate ||0;
      this.bloodPressure = departmentList.bloodPressure || '';
      this.respiratoryRate = departmentList.respiratoryRate ||0;
      this.temperature = departmentList.temperature ||0;
      this.oxygenSaturation = departmentList.oxygenSaturation ||0;
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
