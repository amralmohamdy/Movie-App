import { Component, ElementRef, OnInit, ViewChild, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MoviesResources } from '../../shared/movies-resources';
import { Skeleton } from '../skeleton/skeleton';
import { SafePipe } from '../../pipes/safe-pipe';
import { Item } from "../home/item/item";
import { WishlistResourceService } from '../../shared/wishlist-resource-service';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule, Skeleton, SafePipe, Item],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})

export default class Details implements OnInit {
  @ViewChild('trailerModal') trailerModal!: ElementRef<HTMLDialogElement>;
  router = inject(Router)
  private route = inject(ActivatedRoute);
  svc = inject(MoviesResources);
  WishlistResourceSvc = inject(WishlistResourceService);


  isTrailerOpen: boolean = false;
  youtubeUrl: string = '';

  openModal(trailerKey: string) {
    this.isTrailerOpen = true;
    this.youtubeUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;
    this.trailerModal.nativeElement.showModal();
  }

  closeModal() {
    this.isTrailerOpen = false;
    this.youtubeUrl = null!;
    this.trailerModal.nativeElement.close();
  }

  onBackdropClick(event: MouseEvent) {
    const dialogEl = this.trailerModal.nativeElement;
    if (event.target === dialogEl) this.closeModal();
  }




  imageBase = 'https://image.tmdb.org/t/p/w500';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id && !isNaN(id)) {
        this.svc.id.set(id);
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

  }

  get film() {
    return this.svc.movieDetails.value();
  }

  get recommendations() {
    const results = this.svc.movieRecommendations.value()?.results ?? [];
    const cartoonRecs = results.filter(r => r.genre_ids?.includes(16));
    return cartoonRecs.slice(0, 6);
  }


  get trailerKey() {
    const videos = this.svc.movieTrailer.value()?.results ?? [];
    const trailer = videos.find(
      (v: any) =>
        v.site?.toLowerCase() === 'youtube' &&
        (v.type?.toLowerCase() === 'trailer' || v.type?.toLowerCase() === 'teaser')
    );
    return trailer ? trailer.key : null;
  }

  get isLoadingAll() {
    return (
      this.svc.movieDetails.isLoading() ||
      this.svc.movieTrailer.isLoading() ||
      this.svc.movieRecommendations.isLoading()
    );
  }

  get hasError() {
    return (
      this.svc.movieDetails.error() ||
      this.svc.movieTrailer.error() ||
      this.svc.movieRecommendations.error()
    );
  }

  formatRuntime(mins: number | null | undefined) {
    if (!mins) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  math(rating: number): number {
    return (rating / 2);
  }

  isInWishlist = computed(() => {
    if (this.film?.id) {
      return this.WishlistResourceSvc.wishlistIds().includes(this.film.id);
    } else{
      return;
    }
  });

  async toggleWishlist() {
    if (this.isInWishlist() && this.film?.id ) {
      await this.WishlistResourceSvc.removeItem(this.film.id);
    } else if(this.film?.id) {
      await this.WishlistResourceSvc.addItem(this.film.id);
    }
  }
}
