import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MoviesResources } from '../../shared/movies-resources';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  // controls whether the mobile menu is visible (small screens)
  menuOpen: boolean = false;

  // placeholder watchlist count; replace with real data from a service when available
  watchlistCount: number = 3;

  // simple toggle method (optional use) — template currently toggles via binding
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  svc = inject(MoviesResources);
  changeLanguage(lang: string) {
    this.svc.lang.set(lang);
    const dir = lang.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    console.log('Language Changed:', lang, 'Direction:', dir);
  }

  isDarkMode = false;

  ngOnInit() {
    // لو المستخدم اختار مود قبل كده، نحفظه
    const theme = localStorage.getItem('theme') || 'light';
    this.applyTheme(theme);
    //event on signal
    // Reactively update dir when lang changes

  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    this.applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    this.isDarkMode = theme === 'dark';
  }

}
