import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToTopButton } from './back-to-top-button';

describe('BackToTopButton', () => {
  let component: BackToTopButton;
  let fixture: ComponentFixture<BackToTopButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackToTopButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackToTopButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
