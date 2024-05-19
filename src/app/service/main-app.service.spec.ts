import { TestBed } from '@angular/core/testing';

import { BackendService } from './main-app.service';

describe('MainAppService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
