import { Component, signal, ChangeDetectionStrategy, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../home/item/item'; // تأكد path صحيح
import { IMovie } from '../../models/imovie';
import { MoviesResources } from '../../shared/movies-resources';
import { Skeleton } from '../skeleton/skeleton';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-new-releases',
  standalone: true,
  imports: [CommonModule, Item, Skeleton, TranslatePipe],
  templateUrl: './new-releases.html',
  styleUrls: ['./new-releases.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewReleasesComponent implements OnInit {
  private moviesResources = inject(MoviesResources);
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
      const lang = this.moviesResources.lang();

      // استدعاء دالة الجلب الصريحة من الخدمة
      const json = await this.moviesResources.fetchNowPlayingMovies(page, lang);

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
    pageNum = Math.max(1, Math.min(pageNum, this.totalPages()));
    this.page.set(pageNum);
    await this.loadMovies(pageNum);
  }

  async nextPage() { await this.changePage(this.page() + 1); }
  async prevPage() { await this.changePage(this.page() - 1); }
}
