import { Routes } from '@angular/router';

export const routes: Routes = [

    //Default Route
    { path: '', loadComponent: () => import('./components/home/homepage/homepage'), title: 'Home' },

    //Named Routes
    { path: 'watchlist', loadComponent: () => import('./components/watchlist/watchlist'), title: 'Watchlist' },
    { path: 'login', loadComponent: () => import('./components/login/login'), title: 'Login' },
    { path: 'register', loadComponent: () => import('./components/register/register'), title: 'Register' },

    //Paramterized Route
    { path: 'movies/:id', loadComponent: () => import('./components/details/details'), title: 'Movie Details' },
    { path: 'search', loadComponent: () => import('./components/search/search'), title: 'Movie Search' },


    
  // ✅ New Route for Movies by Genre
{ path: 'genres', loadComponent: () => import('./components/genre/genres').then(m => m.GenresComponent), title: 'Genres' },

  // ✅ New Route for New Releases

  {
  path: 'new',
  loadComponent: () => import('./components/new-releases/new-releases')
    .then(m => m.NewReleasesComponent),
  title: 'New Releases'
},

// ✅ New Route for Browse
{ path: 'browse', loadComponent: () => import('./components/browse/browse').then(m => m.BrowseComponent), title: 'Browse' }



];
