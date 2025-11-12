import { Component, DOCUMENT, HostListener, inject, signal } from '@angular/core';

@Component({
  selector: 'app-back-to-top-button',
  imports: [],
  templateUrl: './back-to-top-button.html',
  styleUrl: './back-to-top-button.css',
})
export class BackToTopButton {
  private document = inject(DOCUMENT);
  isVisible = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = this.document.documentElement.scrollTop || this.document.body.scrollTop;
    this.isVisible.set(scrollPosition > 300);
  }

  scrollToTop(): void {
    this.document.defaultView?.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }

}
