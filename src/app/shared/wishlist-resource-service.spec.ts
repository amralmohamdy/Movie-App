import { TestBed } from '@angular/core/testing';

import { WishlistResourceService } from './wishlist-resource-service';

describe('WishlistResourceService', () => {
  let service: WishlistResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishlistResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
