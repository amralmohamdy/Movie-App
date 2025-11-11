import { Component } from '@angular/core';
import { Item } from '../home/item/item';

@Component({
  selector: 'app-wishlist',
  imports: [Item],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export default class Wishlist {

}
