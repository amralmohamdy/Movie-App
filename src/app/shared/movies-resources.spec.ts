import { TestBed } from '@angular/core/testing';

import { MoviesResources } from './movies-resources';

describe('MoviesResources', () => {
  let service: MoviesResources;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviesResources);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
