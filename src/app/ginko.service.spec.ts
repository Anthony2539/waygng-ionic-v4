import { TestBed, inject } from '@angular/core/testing';

import { GinkoService } from './ginko.service';

describe('GinkoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GinkoService]
    });
  });

  it('should be created', inject([GinkoService], (service: GinkoService) => {
    expect(service).toBeTruthy();
  }));
});
