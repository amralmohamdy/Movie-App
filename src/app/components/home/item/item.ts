import { Component, computed, inject, Input, input, signal } from '@angular/core';
import { IMovie } from '../../../models/imovie';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { WishlistResourceService } from '../../../shared/wishlist-resource-service';
import { AuthService } from '../../../services/auth-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../shared/toast-service';

@Component({
  selector: 'app-item',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {
  toast = inject(ToastService);
  private translate = inject(TranslateService);
  WishlistResourceSvc = inject(WishlistResourceService);
  auth = inject(AuthService);


  @Input()
  film: IMovie = {
    adult: false,
    backdrop_path: '',
    genre_ids: [],
    id: 0,
    original_language: 'en',
    original_title: '',
    overview: '',
    popularity: 0,
    poster_path: '',
    release_date: '',
    title: '',
    video: false,
    vote_average: 0,
    vote_count: 0,
  };


  isInWishlist = computed(() => {
    return this.WishlistResourceSvc.wishlistIds().includes(this.film.id);
  });

  async toggleWishlist() {
    if (!this.auth.currentUser) {
      this.showToastMessage(this.translate.instant('item.login_required'), 'error');
      return;
    }

    if (this.isInWishlist()) {
      await this.WishlistResourceSvc.removeItem(this.film.id);
      this.showToastMessage(this.translate.instant('item.removed'), 'info');
    } else {
      await this.WishlistResourceSvc.addItem(this.film.id);
      this.showToastMessage(this.translate.instant('item.added'), 'success');
    }
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
      this.toast.show(message, type, 4000);
  }
}
