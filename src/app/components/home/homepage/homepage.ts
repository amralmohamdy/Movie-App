import { Component, computed, inject } from '@angular/core';
import { MoviesResources } from '../../../shared/movies-resources';
import { CommonModule } from '@angular/common';
import { Hero } from '../hero/hero';
import { Item } from '../item/item';
import { Skeleton } from '../../skeleton/skeleton';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, Hero,Item, Skeleton],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export default class Homepage {
  svc = inject(MoviesResources);
  searchTerm = '';
  
  Movies = computed(() => this.svc.movieResource.value()?.results ?? []);
  totalPages = computed(() => this.svc.movieResource.value()?.total_pages ?? 1);
  visibleCount = 10;
  
  visiblePages = computed(() => {
    const current = this.svc.page();
    const total = this.totalPages();

    const start = Math.floor((current - 1) / this.visibleCount) * this.visibleCount + 1;
    const end = Math.min(start + this.visibleCount - 1, total);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });


  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.svc.page.set(pageNumber);
    }
  }

 
}
