import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HassanComponent } from './hassan.component';

describe('HassanComponent', () => {
  let component: HassanComponent;
  let fixture: ComponentFixture<HassanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HassanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HassanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
