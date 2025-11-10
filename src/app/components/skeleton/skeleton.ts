import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
})
export  class Skeleton {
  @Input() type: 'details' | 'list' | 'card' = 'card';

}
