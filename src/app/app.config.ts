import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideTranslateService, provideTranslateLoader } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideHttpClient } from "@angular/common/http";


import { routes } from './app.routes';
const firebaseConfig =
{
  apiKey: "AIzaSyDhKbUHItXNe6QzaCxfWzoZR3GHNDneH9g",
  authDomain: "movie-app-f4f9c.firebaseapp.com",
  projectId: "movie-app-f4f9c",
  storageBucket: "movie-app-f4f9c.firebasestorage.app",
  messagingSenderId: "577440052961",
  appId: "1:577440052961:web:b51648848cfa30097f29a0"
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader()})
  ]
};
