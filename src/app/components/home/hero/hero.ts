import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  @Input()
  searchTerm = '';
  constructor(private router: Router) { }


  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    }
  }

}
