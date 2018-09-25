import { TestBed, inject } from '@angular/core/testing';

import { GtfsService } from './gtfs.service';

describe('GtfsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GtfsService]
    });
  });

  it('should be created', inject([GtfsService], (service: GtfsService) => {
    expect(service).toBeTruthy();
  }));
});
