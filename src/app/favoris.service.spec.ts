import { TestBed, inject } from '@angular/core/testing';

import { FavorisService } from './favoris.service';

describe('FavorisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavorisService]
    });
  });

  it('should be created', inject([FavorisService], (service: FavorisService) => {
    expect(service).toBeTruthy();
  }));
});
