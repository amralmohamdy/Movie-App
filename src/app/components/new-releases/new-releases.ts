import { Component, signal, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../home/item/item'; // تأكد path صحيح
import { IMovie } from '../../models/imovie';

@Component({
  selector: 'app-new-releases',
  standalone: true,
  imports: [CommonModule, Item],
  templateUrl: './new-releases.html',
  styleUrls: ['./new-releases.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReleasesComponent implements OnInit {
  private readonly TMDB_API_KEY = '157937b13bdcff4a5ba2df9a51fb2236';
  
  movies = signal<IMovie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Pagination
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
    await this.loadMovies();
  }

  async loadMovies(page = 1) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const params = new URLSearchParams({
        api_key: this.TMDB_API_KEY,
        language: 'en-US',
        page: String(page),
        include_adult: 'false'
      });
      const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch new releases');
      const json = await res.json();
      this.movies.set(json.results ?? []);
      this.totalPages.set(json.total_pages ?? 1);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : String(err));
      this.movies.set([]);
      this.totalPages.set(1);
    } finally {
      this.loading.set(false);
    }
  }

  async changePage(pageNum: number) {
    if (pageNum < 1) pageNum = 1;
    if (pageNum > this.totalPages()) pageNum = this.totalPages();
    this.page.set(pageNum);
    await this.loadMovies(pageNum);
  }

  async nextPage() { await this.changePage(this.page() + 1); }
  async prevPage() { await this.changePage(this.page() - 1); }
}
