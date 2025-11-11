import { Component, inject, Input, input } from '@angular/core';
import { IMovie } from '../../../models/imovie';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { WishlistService } from '../../../services/wishlist-service';

@Component({
  selector: 'app-item',
  imports: [CommonModule, RouterLink],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {
  
  public wishlistService = inject(WishlistService);

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


}
