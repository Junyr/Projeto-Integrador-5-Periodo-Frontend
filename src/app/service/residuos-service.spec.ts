import { TestBed } from '@angular/core/testing';

import { ResiduosService } from './residuos-service';

describe('ResiduosService', () => {
  let service: ResiduosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResiduosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
