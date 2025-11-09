import { Component, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesResources } from '../../shared/movies-resources';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Item } from "../home/item/item";
import { Hero } from "../home/hero/hero";

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule, Item, Hero],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export default class Search {


constructor(
    private route: ActivatedRoute,
    public moviesService: MoviesResources
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const query = params.get('q') || '';
      this.moviesService.searchQuery.set(query); 
    });
  }

  movies = computed(() => this.moviesService.searchMovies.value()?.results || []);
    
}
