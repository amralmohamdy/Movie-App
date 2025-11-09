import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  auth : null | { email: string; username: string, currentUser: boolean } = null;

  ngOnInit() {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      this.auth = JSON.parse(storedAuth);
    }
  }
}
