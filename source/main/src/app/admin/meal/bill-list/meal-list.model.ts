
export class BillList {
  idRecommendation: number;
  //img: string;
  recommendedMeal: string;
  recommendationDate: string;
  ingredients: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  cholesterol: number;
  dietPlan:  number;

  constructor(billList: BillList) {
    {
      this.idRecommendation = billList.idRecommendation || this.getRandomID();
      //this.img = billList.img || 'assets/images/user/user1.jpg';
      this.recommendedMeal = billList.recommendedMeal || '';
      this.recommendationDate = billList.recommendationDate || '';
      this.ingredients = billList.ingredients || '';
      this.calories = billList.calories || 0;
      this.protein = billList.protein || 0;
      this.carbohydrates = billList.carbohydrates || 0;
      this.fat = billList.fat || 0;
      this.cholesterol = billList.cholesterol || 0;
      this.dietPlan = billList.dietPlan || 0;
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
