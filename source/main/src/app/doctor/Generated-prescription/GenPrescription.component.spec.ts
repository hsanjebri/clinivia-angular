import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionsComponent } from './GenPrescription.component';

describe('ItemStockListComponent', () => {
  let component: PrescriptionsComponent;
  let fixture: ComponentFixture<PrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PrescriptionsComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
