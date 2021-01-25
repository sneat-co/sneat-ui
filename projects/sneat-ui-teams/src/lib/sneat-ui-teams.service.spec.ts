import { TestBed } from '@angular/core/testing';

import { SneatUiTeamsService } from './sneat-ui-teams.service';

describe('SneatUiTeamsService', () => {
  let service: SneatUiTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SneatUiTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
