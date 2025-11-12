import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-not-found',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export default class NotFound {

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

}

