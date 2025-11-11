import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MoviesResources } from '../../shared/movies-resources';
import { CommonModule } from '@angular/common';
import { Theme } from '../../shared/theme';
import { WishlistResourceService } from '../../shared/wishlist-resource-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  svc = inject(MoviesResources);
  private theme = inject(Theme);
  wishlistResource = inject(WishlistResourceService);
  wishlistCount = computed(() => this.wishlistResource.wishlistCount());


  menuOpen: boolean = false;
  watchlistCount: number = 3;

  constructor() {
    effect(() => {
      const current = this.theme.theme();
      document.documentElement.setAttribute('data-theme', current);
    });
  }

  // --- Language Handling ---
  getFlagUrl(lang: string): string {
    const code = lang.slice(0, 2).toLowerCase();
    switch (code) {
      case 'ar': return 'https://flagcdn.com/w20/eg.png';
      case 'en': return 'https://flagcdn.com/w20/us.png';
      case 'fr': return 'https://flagcdn.com/w20/fr.png';
      default: return 'earth-white.png';
    }
  }

  changeLanguage(lang: string) {
    this.svc.lang.set(lang);
    const dir = lang.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    console.log('Language Changed:', lang, 'Direction:', dir);
  }

  // --- Menu ---
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // --- Theme ---
  toggleTheme() {
    this.theme.toggle();
  }

  get isDarkMode() {
    return this.theme.theme() === 'dark';
  }
}
