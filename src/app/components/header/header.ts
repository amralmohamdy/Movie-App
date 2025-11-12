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
    // 1. --- LANGUAGE INITIALIZATION (LOAD FROM LOCAL STORAGE) ---
    const storedLang = localStorage.getItem('appLang');
    const defaultLang = 'en'; // افترض 'en' كإعداد افتراضي إذا لم يتم العثور على أي شيء

    // تحديد اللغة الأولية (المخزنة > الافتراضية)
    const initialLang = storedLang || defaultLang;

    // تطبيق اللغة على ngx-translate
    this.translate.use(initialLang);

    // تطبيق اتجاه النص (RTL/LTR)
    const dir = initialLang.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);

    // تحديث Signal اللغة في الخدمة
    this.svc.lang.set(initialLang);

    // 2. --- THEME EFFECT ---
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
    const langCode = lang.slice(0, 2);

    // 1. **SAVE TO LOCAL STORAGE**
    localStorage.setItem('appLang', langCode);

    // 2. Update the translation service (ngx-translate)
    this.translate.use(langCode);

    // 3. Update internal state/direction
    this.svc.lang.set(langCode);
    const dir = langCode.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);

    console.log('Language Changed:', langCode, 'Direction:', dir);
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
