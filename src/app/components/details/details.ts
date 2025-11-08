import { Component, inject, Input, OnInit } from '@angular/core';
import { MoviesResources } from '../../shared/movies-resources';
import { CommonModule } from '@angular/common';
import { IMovie } from '../../models/imovie';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  constructor(private activateRouter: ActivatedRoute) { }
  svc = inject(MoviesResources);

 film: IMovie = {
    adult: false,
    backdrop_path: '',
    genre_ids: [],
    id: 0,
    original_language: 'en',
    original_title: '',
    overview: '',
    popularity: 0,
    poster_path: '',
    release_date: '',
    title: '',
    video: false,
    vote_average: 0,
    vote_count: 0,
  };
  //get id from route param and set it to svc.id signal

  ngOnInit() {
    this.svc.id.set(this.activateRouter.snapshot.params['id']);
    console.log(this.svc.movieDetails.value());
  }





}
