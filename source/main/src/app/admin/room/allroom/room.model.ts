  import {Patient} from "../../patients/allpatients/patient.model";
  export class Room {
    idDiet: number;
    startDate: Date;
    endDate: Date;
    planDescription: string;
    patientName: string;
    dietType: string;
   // mealRecommendations: MealRecommendation[];
    patient: Patient | undefined;
    constructor(dietPlan: Room) {
      {
        this.idDiet = dietPlan?.idDiet || this.getRandomID();
        this.startDate = dietPlan?.startDate || new Date();
        this.endDate = dietPlan?.endDate || new Date();
        this.planDescription = dietPlan?.planDescription || '';
        this.patientName = dietPlan?.patientName || '';
        this.dietType = dietPlan?.dietType || '';

      }
    }
    public getRandomID(): number {
      const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
      };
      return S4() + S4();
    }
  }
