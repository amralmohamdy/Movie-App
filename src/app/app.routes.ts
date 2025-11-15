import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  //Default Route
  { path: '', loadComponent: () => import('./components/home/homepage/homepage'), title: 'Home' },
  //Named Routes
  { path: 'login', loadComponent: () => import('./components/login/login'), title: 'Login',canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./components/register/register'), title: 'Register', canActivate: [guestGuard] },
  { path: 'account', loadComponent: () => import('./components/account/account'), title: 'Account', canActivate: [authGuard] },
  { path: 'wishlist', loadComponent: () => import('./components/wishlist/wishlist'), title: 'wishlist', canActivate: [authGuard] },
  { path: 'genres', loadComponent: () => import('./components/genre/genres'), title: 'Genres' },
  { path: 'new', loadComponent: () => import('./components/new-releases/new-releases'), title: 'New Releases' },
  { path: 'browse', loadComponent: () => import('./components/browse/browse'), title: 'Browse' },
  //Paramterized Route
  { path: 'movies/:id', loadComponent: () => import('./components/details/details'), title: 'Movie Details' },
  { path: 'genres/:id', loadComponent: () => import('./components/genre/genres'), title: 'Genres' },
  { path: 'search', loadComponent: () => import('./components/search/search'), title: 'Movie Search' },
  //Not Found
  { path: '**', loadComponent: () => import('./components/not-found/not-found'), title: 'Not Found | 404 Page' },

];
