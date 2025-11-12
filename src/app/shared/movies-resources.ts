import { Injectable, resource, signal } from '@angular/core';
import { IDetails } from '../models/idetails';
import { IMmdbModel } from '../models/immdb-model';
import { IGenre } from '../models/igenre';

@Injectable({
  providedIn: 'root',
})
export class MoviesResources {
  API_KEY : string = '157937b13bdcff4a5ba2df9a51fb2236';
  page = signal(1);
  lang = signal('en-US');
  id = signal(0);


  // Popular / Top Rated / Upcoming
async fetchPopularMovies(page: number, language: string): Promise<IMmdbModel> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${this.API_KEY}&language=${language}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch popular movies');
    return res.json() as Promise<IMmdbModel>;
}

async fetchTopRatedMovies(page: number, language: string): Promise<IMmdbModel> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${this.API_KEY}&language=${language}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch top rated movies');
    return res.json() as Promise<IMmdbModel>;
}

async fetchUpcomingMovies(page: number, language: string): Promise<IMmdbModel> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${this.API_KEY}&language=${language}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch upcoming movies');
    return res.json() as Promise<IMmdbModel>;
}
  // New Releases
  // New Releases (Now Playing)
  async fetchNowPlayingMovies(page: number, language: string): Promise<IMmdbModel> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.API_KEY}&language=${language}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch now playing movies');
    return res.json() as Promise<IMmdbModel>;
  }

  // Genres list
  genresList = resource({
    loader: async () => {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.API_KEY}&language=${this.lang()}`);
      if (!res.ok) throw new Error('Failed to fetch genres');
      return (await res.json()).genres as IGenre[];
    }
  });

  // Movies by Genre or Discover (all)
  async fetchMoviesByGenre(genreId: number, page: number, language: string): Promise<IMmdbModel> {
    const url = genreId !== 0
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&language=${language}&page=${page}&with_genres=${genreId}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&language=${language}&page=${page}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch movies');
    const data = await res.json();
    return data as IMmdbModel;
  } movieResource = resource({
    //make dynamic page number as params that takes from ts
    params: () => ({ page: this.page(), language: this.lang() }),
    loader: async ({ params }) => {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&with_genres=16,10751&include_adult=false&page=${params.page}&language=${params.language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      return data as IMmdbModel;
    }
  });


  // Movie Details Resource

  movieDetails = resource({
    params: () => ({ id: this.id() }),
    loader: async ({ params }) => {
      if (params.id === 0) return null;
      const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${this.API_KEY}&language=${this.lang()}`);
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
      if (params.id === 0) return null;
      const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${this.API_KEY}&language=${this.lang()}`);
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
      if (params.id === 0) return null;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}/recommendations?api_key=${this.API_KEY}&with_genres=16,10751&include_adult=false&language=${params.language}&page=1`
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
        `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&language=${params.language}&query=${params.query}&page=${params.page}`
      );
      if (!response.ok) throw new Error('Failed to search movies');
      const data = await response.json();
      return data as IMmdbModel;
    },
  });
}
