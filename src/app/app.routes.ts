import { Routes } from '@angular/router';
import { Watchlist } from './components/watchlist/watchlist';
import { Homepage } from './components/home/homepage/homepage';
import { Login } from './components/login/login';
import { Footer } from './components/footer/footer';
import { Details } from './components/details/details';
import { Register } from './components/register/register';
import { NotFoundError } from 'rxjs';

export const routes: Routes = [

    {path:'',component:Homepage},
    {path:'watchlist',component:Watchlist},
    {path:'footer',component:Footer},
    {path:'details',component:Details},
    {path:'login',component:Login},
    {path:'register',component:Register},
    {path:'**',component:NotFoundError},
];
