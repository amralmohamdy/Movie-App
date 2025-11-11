import { Component, inject, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { WishlistResourceService } from '../../shared/wishlist-resource-service';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  imports: [],
  styleUrls: ['./account.css'],
  standalone: true,
})
export default class AccountComponent {
  private router = inject(Router);
  public wishlistSvc = inject(WishlistResourceService);
  constructor(public authSvc: AuthService) {
    effect(() => {
      if (!this.currentUser()) {
        this.router.navigate(['/login']);
      }
    });

  }

  currentUser = computed(() => this.authSvc.currentUser);

  wishlistCount = computed(() => this.wishlistSvc.wishlistCount());

  logout() {
    this.authSvc.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  changePassword() {
    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;

    this.authSvc.changePassword(newPassword)
      .then(() => alert('Password updated successfully!'))
      .catch(err => alert('Error: ' + err.message));
  }
}
