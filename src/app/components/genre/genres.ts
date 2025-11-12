import { Component, signal, ChangeDetectionStrategy, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Item } from '../home/item/item';
import { IMovie } from '../../models/imovie';
import { MoviesResources } from '../../shared/movies-resources';
import { IGenre } from '../../models/igenre';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [CommonModule, Item, Skeleton, RouterLink],
  templateUrl: './genres.html',
  styleUrls: ['./genres.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GenresComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesResources = inject(MoviesResources);
  router = inject(Router);

  readonly IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  genres = signal<IGenre[]>([]);
  movies = signal<IMovie[]>([]);

  loadingGenres = signal(false);
  errorGenres = signal<string | null>(null);

  loadingMovies = signal(false);
  errorMovies = signal<string | null>(null);

  selectedGenreId = signal<number | null>(null);
  page = signal(1);
  totalPages = signal(1);

  selectedGenreName = computed(() => {
    const id = this.selectedGenreId();
    if (!id) return 'All';
    return this.genres().find(g => g.id === id)?.name ?? 'Selected';
  });

  visiblePages = computed(() => {
    const cur = this.page();
    const total = this.totalPages();
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, cur - half);
    let end = Math.min(total, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  });

  async ngOnInit() {
    await this.loadGenres();

    this.route.paramMap.subscribe(async params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : 0;
      if (id !== this.selectedGenreId()) {
        this.selectedGenreId.set(id);
        this.page.set(1);
        await this.loadMovies();
      }
    });
  }

  async loadGenres() {
    this.loadingGenres.set(true);
    this.errorGenres.set(null);
    try {
      const data = await this.moviesResources.genresList.value();
      this.genres.set(data ?? []);
    } catch (err: unknown) {
      this.errorGenres.set(err instanceof Error ? err.message : String(err));
      this.genres.set([]);
    } finally {
      this.loadingGenres.set(false);
    }
  }

  async selectGenre(id: number | null) {
    if (this.selectedGenreId() === id) return;
    this.selectedGenreId.set(id);
    this.page.set(1);
    await this.loadMovies();
  }

  async loadMovies() {
    this.loadingMovies.set(true);
    this.errorMovies.set(null);
    try {
      const genreId = this.selectedGenreId() ?? 0;
      const currentPage = this.page();
      const lang = this.moviesResources.lang(); // افترض أن lang متاح من الخدمة

      const data = await this.moviesResources.fetchMoviesByGenre(genreId, currentPage, lang);

      this.movies.set(data?.results ?? []);
      this.totalPages.set(data?.total_pages ?? 1);
    } catch (err: unknown) {
      this.errorMovies.set(err instanceof Error ? err.message : String(err));
      this.movies.set([]);
      this.totalPages.set(1);
    } finally {
      this.loadingMovies.set(false);
    }
  }

  async changePage(pageNum: number) {
    pageNum = Math.max(1, Math.min(pageNum, this.totalPages()));
    this.page.set(pageNum);
    await this.loadMovies();
  }

  async nextPage() { await this.changePage(this.page() + 1); }
  async prevPage() { await this.changePage(this.page() - 1); }
}
