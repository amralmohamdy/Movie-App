import { Injectable, resource, signal } from '@angular/core';
import { IMovie } from '../models/imovie';
import { IMmdbModel } from '../models/immdb-model';

@Injectable({
  providedIn: 'root',
})
export class MoviesResources {
  // //make connect with api using APIResource resource angaular feature with api key in header https://api.themoviedb.org/3/movie/now_playing?api_key=157937b13bdcff4a5ba2df9a51fb2236
  page = signal(1);
  lang = signal('en-US');

  movieResource = resource({
    //make dynamic page number as params that takes from ts
    params: () => ({ page: this.page(), language: this.lang() }),
    loader: async ({ params }) => {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=157937b13bdcff4a5ba2df9a51fb2236&with_genres=16,10751&include_adult=false&page=${params.page}&language=${params.language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      return data as IMmdbModel;
    }
  });
}
