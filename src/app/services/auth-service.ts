import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updatePassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  /** Signal لمتابعة حالة الـ user */
  currentUserSignal = signal<User | null>(this.auth.currentUser);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSignal.set(user);
    });
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser() {
    return this.currentUserSignal();
  }

   changePassword(newPassword: string) {
    if (!this.currentUser) {
      return Promise.reject(new Error('User not logged in'));
    }

    return updatePassword(this.currentUser, newPassword);
  }
}
