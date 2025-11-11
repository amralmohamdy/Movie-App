import { Injectable, computed, resource, signal } from '@angular/core';
import { IDetails } from '../models/idetails';
import { WishlistService } from '../services/wishlist-service';
import { MoviesResources } from './movies-resources';
import { IMovie } from '../models/imovie';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class WishlistResourceService {
  constructor(public wishlistSvc: WishlistService, private auth: Auth, private movies: MoviesResources) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadInitialWishlist();
      } else {
        this.wishlistIds.set([]);
        this.wishlistMoviesResource.reload();
      }
    });
  }

  /** Signal to hold wishlist movie IDs */
  wishlistIds = signal<number[]>([]);
  wishlistCount = computed(() => this.wishlistIds().length);


  /** Resource to load wishlist IDs from Firestore */
  wishlistIdsResource = resource({
    loader: async () => {
      const snapshot = await this.wishlistSvc.getWishlist().toPromise();
      const ids = snapshot!.map((item) => item.id);
      this.wishlistIds.set(ids);
      return ids;
    },
  });

  /** Resource to load actual TMDB movie details */
  wishlistMoviesResource = resource({
    // depend on both wishlist IDs and current language
    params: () => ({
      ids: this.wishlistIds(),
      language: this.movies.lang(),
    }),
    loader: async ({ params }) => {
      if (!params.ids?.length) return [];
      const results: IMovie[] = [];

      await Promise.all(
        params.ids.map(async (id) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=157937b13bdcff4a5ba2df9a51fb2236&language=${params.language}`
          );
          if (res.ok) {
            const data = await res.json();
            results.push(data);
          }
        })
      );

      return results;
    },
  });
  async loadInitialWishlist() {
    // 🔹 جلب البيانات مباشرة عند init
    const snapshot = await this.wishlistSvc.getWishlist().toPromise();
    const ids = snapshot!.map(item => item.id);
    this.wishlistIds.set(ids);
    this.wishlistMoviesResource.reload();
  }

  /** Refresh manually (for example after add/remove) */
  async refresh() {
    const snapshot = await this.wishlistSvc.getWishlist().toPromise();
    const ids = snapshot!.map((item) => item.id);
    this.wishlistIds.set(ids);
    this.wishlistMoviesResource.reload(); // reload data
  }


  async addItem(id: number) {
    await this.wishlistSvc.addToWishlist(id);
    await this.refresh();
  }

  async removeItem(id: number) {
    await this.wishlistSvc.removeFromWishlist(id);
    await this.refresh();
  }


}
