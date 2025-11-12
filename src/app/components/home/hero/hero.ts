import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Theme } from '../../../shared/theme';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-hero',
  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {


  @Input()
  searchTerm = '';
  constructor(private router: Router, public theme: Theme) {
  }


  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    }
  }

  get isDarkMode() {
    return this.theme.theme() === 'dark';
  }



}
