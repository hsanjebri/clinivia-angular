import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentListComponent } from './vitalsign-list.component';
describe('DepartmentListComponent', () => {
  let component: DepartmentListComponent;
  let fixture: ComponentFixture<DepartmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DepartmentListComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
