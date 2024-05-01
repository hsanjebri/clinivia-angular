import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealListComponent } from './meal-list.component';

describe('BillListComponent', () => {
  let component: MealListComponent;
  let fixture: ComponentFixture<MealListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MealListComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
