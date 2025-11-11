import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../services/wishlist-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css',
})
export default class Watchlist implements OnInit, OnDestroy {
  wishlist: any[] = [];
  newItem = '';

  private wishlistService = inject(WishlistService);
  private sub: Subscription | null = null;

  ngOnInit() {
    this.loadWishlist();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }

  loadWishlist() {
    // subscribe to the observable returned by the service
    this.sub = this.wishlistService.getWishlist().subscribe({
      next: (items: any[]) => {
        try {
          // Ensure the Firestore document id is used as the unique `id` for tracking.
          // Put id last when spreading so it cannot be overridden by a field in the
          // document data (e.g. a movie's own `id` field).
          this.wishlist = (items ?? []).map((it: any) => ({ ...it, id: String(it.id) }));
          console.log('Loaded wishlist:', this.wishlist);
        } catch (err) {
          console.error('Error mapping wishlist items:', err, items);
        }
      },
      error: (err) => console.error('Error loading wishlist:', err),
    });
  }

  addItem() {
    const name = (this.newItem || '').trim();
    if (!name) return;

    this.wishlistService.addToWishlist({ name }).subscribe({
      next: () => {
        this.newItem = '';
        this.loadWishlist();
      },
      error: (err) => console.error('Error adding wishlist item:', err),
    });
  }

  removeItem(id: any) {
    console.log('Removing item id:', id, 'type:', typeof id);
    if (!id) {
      console.error('removeItem called with invalid id:', id);
      return;
    }

    const sid = String(id);
    this.wishlistService.removeFromWishlist(sid).subscribe({
      next: () => {
        console.log('Item removed:', sid);
        this.loadWishlist();
      },
      error: (err) => console.error('Error removing wishlist item:', err),
    });
  }
}
