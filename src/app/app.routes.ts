import { Routes } from '@angular/router';

export const routes: Routes = [

    //Default Route
    { path: '', loadComponent: () => import('./components/home/homepage/homepage'), title: 'Home' },

    //Named Routes
    { path: 'wishlist', loadComponent: () => import('./components/wishlist/wishlist'), title: 'wishlist' },
    { path: 'login', loadComponent: () => import('./components/login/login'), title: 'Login' },
    { path: 'register', loadComponent: () => import('./components/register/register'), title: 'Register' },

    //Paramterized Route
    { path: 'movies/:id', loadComponent: () => import('./components/details/details'), title: 'Movie Details' },
    { path: 'search', loadComponent: () => import('./components/search/search'), title: 'Movie Search' },
    //Wildcard Route - 404 Not Found
    { path: '**', loadComponent: () => import('./components/not-found/not-found'), title: '404 | Not Found' },
];
