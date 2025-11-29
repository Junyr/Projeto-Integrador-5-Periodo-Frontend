import { TestBed } from '@angular/core/testing';

import { RuasService } from './ruas-service';

describe('RuasService', () => {
  let service: RuasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
