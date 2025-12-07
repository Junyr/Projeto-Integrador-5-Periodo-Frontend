import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { warningFormGuard } from './warning-form-guard';

describe('warningFormGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => warningFormGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
