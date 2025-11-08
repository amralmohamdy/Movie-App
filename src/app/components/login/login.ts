import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  submitting = false;
  error = '';

  constructor(private router: Router) {}

  async onSubmit(e?: Event) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Please provide both email and password.';
      return;
    }

    this.submitting = true;
    try {
      // Mock authentication flow for now. Replace with real API call.
      await new Promise((r) => setTimeout(r, 700));
      // Simple fake validation: accept any email with "@" and password length >= 4
      if (this.email.indexOf('@') === -1 || this.password.length < 4) {
        throw new Error('Invalid credentials');
      }

      // On success, navigate to home (or wherever appropriate)
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err?.message || 'Authentication failed';
    } finally {
      this.submitting = false;
    }
  }

}
