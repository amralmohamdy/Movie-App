import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { BackToTopButton } from './components/back-to-top-button/back-to-top-button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,Header, Footer, BackToTopButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('movie-app');
}
