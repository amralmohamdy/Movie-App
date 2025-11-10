import { Injectable, resource, signal } from '@angular/core';
import { IDetails } from '../models/idetails';
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


  // Movie Details Resource

  id = signal(1);

  movieDetails = resource({
    params: () => ({ id: this.id() }),
    loader: async ({ params }) => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=157937b13bdcff4a5ba2df9a51fb2236&language=${this.lang()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const data = await response.json();
      return data as IDetails;
    }
  });

  movieTrailer = resource({
    params: () => ({ id: this.id() }),
    loader: async ({ params }) => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=157937b13bdcff4a5ba2df9a51fb2236&language=${this.lang()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie trailers');
      }

      const data = await response.json();
      return data;
    }
  });
  movieRecommendations = resource({
    params: () => ({ id: this.id(), language: this.lang() }),
    loader: async ({ params }) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}/recommendations?api_key=157937b13bdcff4a5ba2df9a51fb2236&with_genres=16,10751&include_adult=false&language=${params.language}&page=1`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch movie recommendations');
      }
      const data = await response.json();
      return data as IMmdbModel;
    }
  });


  // Search Movies Resource
  pageSearch = signal(1);
  searchQuery = signal('');

  searchMovies = resource({
    params: () => ({ query: this.searchQuery(), language: this.lang(), page: this.pageSearch() }),
    loader: async ({ params }) => {
      if (!params.query) return null;
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=157937b13bdcff4a5ba2df9a51fb2236&language=${params.language}&query=${params.query}&page=${params.page}`
      );
      if (!response.ok) throw new Error('Failed to search movies');
      const data = await response.json();
      return data as IMmdbModel;
    },
  });
}
