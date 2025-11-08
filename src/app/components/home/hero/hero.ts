import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {


  @Input()
  searchTerm = '';
constructor(private router: Router) {}
  

  onSearch() {
    if (this.searchTerm.trim()) {
      // alert('🔍 Searching for: ' + this.searchTerm);
        this.router.navigate(['/search', this.searchTerm]);
    }
  }

}
