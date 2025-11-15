import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { Item } from '../home/item/item';
import { WishlistResourceService } from '../../shared/wishlist-resource-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, FormsModule, Item, RouterLink, TranslatePipe],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export default class Wishlist implements OnInit {
  wishlistCount = computed(() => this.wishlistResource.wishlistCount());
  newItem: number = 0;
  wishlistMovies = computed(() => this.wishlistResource.wishlistMoviesResource.value() ?? []);
  showSnackbar = signal(false);
  deleting = signal(false);
  progress = signal(0);
  constructor(
    private wishlistResource: WishlistResourceService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.wishlistResource.wishlistIdsResource.reload();
  }

  /** Add item manually (optional) */
  async addItem() {
    if (this.newItem === 0) return;
    try {
      await this.wishlistResource.wishlistIdsResource.reload(); // reload IDs first
      await this.wishlistResource.refresh();
      this.newItem = 0;
    } catch (err) {
      console.error('Error adding item:', err);
    }
  }

  /** Remove item from wishlist */
  async removeItem(id: number) {
    try {
      await this.wishlistResource.wishlistIdsResource.reload(); // reload IDs first
      await this.wishlistResource.refresh();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  }

  async confirmClear() {
    const movieIds = this.wishlistMovies().map((m) => m.id);
    if (!movieIds.length) return;

    this.deleting.set(true); // show loading
    this.progress.set(0);

    const increment = 100 / movieIds.length;

    try {
      for (const id of movieIds) {
        await this.wishlistResource.wishlistSvc.removeFromWishlist(id);
        // تقدّم progress تدريجي
        this.progress.update((p) => Math.min(p + increment, 100));
      }

      await this.wishlistResource.refresh();

      // أظهر toast بعد الحذف
      this.showSnackbar.set(true);
      setTimeout(() => this.showSnackbar.set(false), 4000);
    } catch (err) {
      console.error('Error clearing wishlist:', err);
    } finally {
      this.deleting.set(false);
      // أغلق الـ modal تلقائيًا بعد الحذف
      const modalCheckbox = document.getElementById('confirm-clear') as HTMLInputElement;
      if (modalCheckbox) modalCheckbox.checked = false;
      this.progress.set(0); // reset progress
    }
  }


}
