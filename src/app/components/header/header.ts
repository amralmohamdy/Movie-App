import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { MoviesResources } from '../../shared/movies-resources';
import { CommonModule } from '@angular/common';
import { Theme } from '../../shared/theme';
import { WishlistResourceService } from '../../shared/wishlist-resource-service';
import { AuthService } from '../../services/auth-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  translate = inject(TranslateService);
  auth = inject(AuthService);
  svc = inject(MoviesResources);
  router = inject(Router);
  private theme = inject(Theme);
  wishlistResource = inject(WishlistResourceService);
  wishlistCount = computed(() => this.wishlistResource.wishlistCount());
  menuOpen: boolean = false;

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
    this.translate.use(lang.slice(0,2));
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

  toggleDropdown: boolean = false;



  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);

    });
  }

}
