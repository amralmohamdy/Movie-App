import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../home/item/item';
import { IMovie } from '../../models/imovie';
import { MoviesResources } from '../../shared/movies-resources';
import { IMmdbModel } from '../../models/immdb-model';
import { Skeleton } from '../skeleton/skeleton';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-browse',
  imports: [CommonModule, Item, Skeleton, TranslatePipe],
  templateUrl: './browse.html',
  styleUrls: ['./browse.css'],
})
export default class BrowseComponent implements OnInit {
  private translate = inject(TranslateService);
  private moviesResources = inject(MoviesResources);
  readonly IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

  movies = signal<IMovie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // mode selection
  mode = signal<'popular' | 'top_rated' | 'upcoming'>('popular');
  modeLabel = computed(() => {
    const m = this.mode();
    let key: string;

    if (m === 'popular') {
      key = 'browse.popular';
    } else if (m === 'top_rated') {
      key = 'browse.topRated';
    } else {
      key = 'browse.upcoming';
    }

    return this.translate.instant(key);
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

      // تحديد دالة الجلب المناسبة
      let fetchFunction: (page: number, lang: string) => Promise<IMmdbModel>;
      const lang = this.moviesResources.lang(); // جلب اللغة من الخدمة

      if (m === 'popular') {
        fetchFunction = this.moviesResources.fetchPopularMovies;
      } else if (m === 'top_rated') {
        fetchFunction = this.moviesResources.fetchTopRatedMovies;
      } else { // 'upcoming'
        fetchFunction = this.moviesResources.fetchUpcomingMovies;
      }

      // استدعاء دالة الجلب الصريحة
      const json = await fetchFunction.call(this.moviesResources, page, lang);

      this.movies.set(json.results ?? []);
      this.totalPages.set(json.total_pages ?? 1);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : `Failed to load ${m} movies: ${String(err)}`);
      this.movies.set([]);
      this.totalPages.set(1);
    } finally {
      this.loading.set(false);
    }
  }

  async changePage(pageNum: number) {
    pageNum = Math.max(1, Math.min(pageNum, this.totalPages())); // تبسيط تحقق الحدود
    this.page.set(pageNum);
    await this.loadByMode(this.mode(), pageNum);
  }

  async nextPage() { await this.changePage(this.page() + 1); }
  async prevPage() { await this.changePage(this.page() - 1); }
}
