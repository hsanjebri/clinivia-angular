import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMealComponent } from './add-meal.component';

describe('AddBillComponent', () => {
  let component: AddMealComponent;
  let fixture: ComponentFixture<AddMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AddMealComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
