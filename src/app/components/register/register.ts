import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class Register {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';
  agreeTerms: boolean = false;
  termsModalOpen = false;


  constructor(private auth: AuthService, private router: Router) { }

  async register() {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

}
