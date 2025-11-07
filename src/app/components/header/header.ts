import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MoviesResources } from '../../shared/movies-resources';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLink,RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
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
  }

}
