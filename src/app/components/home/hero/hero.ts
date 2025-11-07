import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  @Input()
  searchTerm = '';

  onSearch() {
    if (this.searchTerm.trim()) {
      alert('🔍 Searching for: ' + this.searchTerm);
      // هنا تقدر تستدعي السيرفس أو تعمل فلترة محلية
      // مثلاً:
      // this.svc.searchMovies(this.searchTerm);
    }
  }

}
