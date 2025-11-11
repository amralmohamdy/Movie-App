import { Component, computed, inject, Input, input } from '@angular/core';
import { IMovie } from '../../../models/imovie';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { WishlistResourceService } from '../../../shared/wishlist-resource-service';

@Component({
  selector: 'app-item',
  imports: [CommonModule, RouterLink],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {

  WishlistResourceSvc = inject(WishlistResourceService);

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
    if (this.isInWishlist()) {
      // لو موجود: نحذفه
      await this.WishlistResourceSvc.removeItem(this.film.id);
    } else {
      // لو مش موجود: نضيفه
      await this.WishlistResourceSvc.addItem(this.film.id);
    }
  }
}
