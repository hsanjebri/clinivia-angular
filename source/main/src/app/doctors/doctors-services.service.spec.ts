import { TestBed } from '@angular/core/testing';

import { DoctorsServicesService } from './doctors-services.service';

describe('DoctorsServicesService', () => {
  let service: DoctorsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
