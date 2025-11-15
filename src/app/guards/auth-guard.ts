import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return new Promise<boolean | any>((resolve) => {
    onAuthStateChanged(auth['auth'], (user) => {
      if (user) {
        resolve(true); // allowed
      } else {
        resolve(router.createUrlTree(['/login'])); // redirect to login
      }
    });
  });
};
