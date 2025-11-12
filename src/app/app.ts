import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { BackToTopButton } from './components/back-to-top-button/back-to-top-button';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, BackToTopButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['fr', 'en', 'ar']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }
  protected readonly title = signal('movie-app');
}
