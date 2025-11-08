import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  username = '';
  password = '';
  confirm = '';
  error = '';
// //private auth: AuthService,
//   constructor( private router: Router) {}

//   register() {
//     this.error = '';
//     if (!this.email || !this.username || !this.password) {
//       this.error = 'All fields are required';
//       return;
//     }
//     if (this.password !== this.confirm) {
//       this.error = 'Passwords do not match';
//       return;
//     }
//     const err = this.auth.register(this.email, this.username, this.password);
//     if (err) this.error = err;
//     else this.router.navigate(['/auth/account']);
//   }

}
