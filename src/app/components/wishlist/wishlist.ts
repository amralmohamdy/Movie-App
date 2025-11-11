import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../services/wishlist-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export default class Wishlist implements OnInit {
  wishlist: any[] = [];
  newItem = '';

  constructor(
    private wishlistService: WishlistService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadWishlist();
  }

  private loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        console.log('Wishlist loaded:', items);
        this.wishlist = items;
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
      }
    });
  }

  async addItem() {
    if (!this.newItem.trim()) return;
    try {
      await this.wishlistService.addToWishlist({ name: this.newItem });
      console.log('Item added successfully');
      this.newItem = '';
      this.loadWishlist();
    } catch (err) {
      console.error('Error adding item:', err);
    }
  }

  async removeItem(id: string) {
    try {
      console.log('Removing item with id:', id);
      await this.wishlistService.removeFromWishlist(id);
      console.log('Item removed successfully');
      this.loadWishlist();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
