import { TestBed } from '@angular/core/testing';

import { SneatUiAuthService } from './sneat-ui-auth.service';

describe('SneatUiAuthService', () => {
  let service: SneatUiAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SneatUiAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
