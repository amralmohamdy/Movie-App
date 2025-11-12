import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesResources } from '../../shared/movies-resources';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Item } from "../home/item/item";
import { IMovie } from '../../models/imovie';
import { Skeleton } from '../skeleton/skeleton';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule, Item, Skeleton, TranslatePipe],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export default class Search {
  route = inject(ActivatedRoute);
  router = inject(Router);
  moviesService = inject(MoviesResources);

  query: string = '';
  movies: IMovie[] = [];

  moviesEffect = effect(() => {
    const data = this.moviesService.searchMovies.value()?.results ?? [];
    if (data.length) {
      this.movies = [...this.movies, ...data];
    }
  });

  movieResults = computed(() => this.moviesService.searchMovies.value()?.results ?? []);
  page: number = 1;
  totalPages = computed(() => this.moviesService.searchMovies.value()?.total_pages ?? 1);
  loading = computed(() => this.moviesService.searchMovies.isLoading() ?? false);

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q') || '';
      if (!this.query.trim()) return;

      this.movies = [];
      this.page = 1;
      this.loadMovies();
    });



  }

  onSearch() {
    if (this.query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.query } });
    }
  }

  async loadMovies() {
    if (!this.query.trim()) return;
    this.moviesService.pageSearch.set(this.page);
    this.moviesService.searchQuery.set(this.query);
  }

  async loadMore() {
    if (this.page < this.totalPages()) {
      this.page++;
      await this.loadMovies();
    }
  }
}