import { Routes } from '@angular/router';
import { Watchlist } from './components/watchlist/watchlist';
import { Homepage } from './components/home/homepage/homepage';
import { Login } from './components/login/login';
import { Details } from './components/details/details';
import { Register } from './components/register/register';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [

    //Default Route
    {path:'',component:Homepage},

    //Nammed Routes
    {path:'watchlist',component:Watchlist, title:'Watchlist'},
    {path:'login',component:Login, title:'Login'},
    {path:'register',component:Register, title:'Register'},

    //Paramterized Route
    {path:'details/:id',component:Details, title:'Movie Details'},

    //Wildcard Route - 404 Not Found
    {path:'**',component:NotFound, title:'404 | Not Found'},
];
