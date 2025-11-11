import { Component, signal, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../home/item/item';
import { IMovie } from '../../models/imovie';

interface IGenre { id: number; name: string; }

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [CommonModule, Item],
  templateUrl: './genres.html',
  styleUrls: ['./genres.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GenresComponent implements OnInit {
  private readonly TMDB_API_KEY = '157937b13bdcff4a5ba2df9a51fb2236';
  readonly IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  genres = signal<IGenre[]>([]);
  movies = signal<IMovie[]>([]);

  loadingGenres = signal(false);
  loadingMovies = signal(false);
  errorGenres = signal<string | null>(null);
  errorMovies = signal<string | null>(null);

  selectedGenreId = signal<number | null>(null);
  selectedGenreName = computed(() => {
    const id = this.selectedGenreId();
    if (!id) return 'All';
    return this.genres().find(g => g.id === id)?.name ?? 'Selected';
  });

  page = signal(1);
  totalPages = signal(1);

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
    if (this.genres().length) this.selectGenre(this.genres()[0].id);
    else await this.loadMoviesByDiscover();
  }

  async loadGenres() {
    this.loadingGenres.set(true);
    this.errorGenres.set(null);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.TMDB_API_KEY}&language=en-US`);
      if (!res.ok) throw new Error(`Failed to fetch genres (${res.status})`);
      const json = await res.json();
      this.genres.set(json.genres ?? []);
    } catch (err: unknown) {
      this.errorGenres.set(err instanceof Error ? err.message : String(err));
      this.genres.set([]);
    } finally {
      this.loadingGenres.set(false);
    }
  }

  async selectGenre(genreId: number) {
    if (this.selectedGenreId() === genreId) return;
    this.selectedGenreId.set(genreId);
    this.page.set(1);
    await this.loadMoviesByGenre(genreId, this.page());
  }

  async loadMoviesByGenre(genreId: number, page = 1) {
    this.loadingMovies.set(true);
    this.errorMovies.set(null);
    try {
      const params = new URLSearchParams({
        api_key: this.TMDB_API_KEY,
        language: 'en-US',
        page: String(page),
        include_adult: 'false',
        with_genres: String(genreId)
      });
      const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch movies (${res.status})`);
      const json = await res.json();
      this.movies.set(json.results ?? []);
      this.totalPages.set(json.total_pages ?? 1);
    } catch (err: unknown) {
      this.errorMovies.set(err instanceof Error ? err.message : String(err));
      this.movies.set([]);
      this.totalPages.set(1);
    } finally {
      this.loadingMovies.set(false);
    }
  }

  async loadMoviesByDiscover(page = 1) {
    this.loadingMovies.set(true);
    this.errorMovies.set(null);
    try {
      const params = new URLSearchParams({
        api_key: this.TMDB_API_KEY,
        language: 'en-US',
        page: String(page),
        include_adult: 'false'
      });
      const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch movies (${res.status})`);
      const json = await res.json();
      this.movies.set(json.results ?? []);
      this.totalPages.set(json.total_pages ?? 1);
    } catch (err: unknown) {
      this.errorMovies.set(err instanceof Error ? err.message : String(err));
      this.movies.set([]);
      this.totalPages.set(1);
    } finally {
      this.loadingMovies.set(false);
    }
  }

  async changePage(pageNum: number) {
    if (pageNum < 1) pageNum = 1;
    if (pageNum > this.totalPages()) pageNum = this.totalPages();
    this.page.set(pageNum);
    if (this.selectedGenreId()) await this.loadMoviesByGenre(this.selectedGenreId()!, pageNum);
    else await this.loadMoviesByDiscover(pageNum);
  }

  async nextPage() { await this.changePage(this.page() + 1); }
  async prevPage() { await this.changePage(this.page() - 1); }
}
