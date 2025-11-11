import { Component, signal, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../home/item/item'; 
import { IMovie } from '../../models/imovie';



@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule , Item],
  templateUrl: './browse.html',
  styleUrls: ['./browse.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BrowseComponent implements OnInit {
  private readonly TMDB_API_KEY = '157937b13bdcff4a5ba2df9a51fb2236';
  readonly IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

  movies = signal<IMovie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // mode selection
  mode = signal<'popular' | 'top_rated' | 'upcoming'>('popular');
  modeLabel = computed(() => {
    const m = this.mode();
    if (m === 'popular') return 'Popular';
    if (m === 'top_rated') return 'Top Rated';
    return 'Upcoming';
  });

  // pagination
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
    await this.loadByMode(this.mode(), this.page());
  }

  setMode(m: 'popular' | 'top_rated' | 'upcoming') {
    if (this.mode() === m) return;
    this.mode.set(m);
    this.page.set(1);
    void this.loadByMode(m, 1);
  }

  async loadByMode(m: 'popular' | 'top_rated' | 'upcoming', page = 1) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const url = `https://api.themoviedb.org/3/movie/${m}?api_key=${this.TMDB_API_KEY}&language=en-US&page=${page}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${m} (${res.status})`);
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
    await this.loadByMode(this.mode(), pageNum);
  }

  async nextPage() { await this.changePage(this.page() + 1); }
  async prevPage() { await this.changePage(this.page() - 1); }
}
