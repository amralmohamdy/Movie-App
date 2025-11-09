import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router'
@Component({
  selector: 'app-not-found',
  imports: [RouterModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export default class NotFound {

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

}

