import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MoviesResources } from '../../shared/movies-resources';
import { IMovie } from '../../models/imovie';
import { IDetails } from '../../models/idetails';


// component for movie details
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})

// details component class
export default class Details implements OnInit {
  private route = inject(ActivatedRoute);
  svc = inject(MoviesResources);

  film: IDetails | null = null;
  recommendations: IMovie[] = [];
  trailerKey: string | null = null;

  loading = true;
  error: string | null = null;

  // same api key used in the app for themoviedb
  private tmdbKey = '157937b13bdcff4a5ba2df9a51fb2236';
  private apiBase = 'https://api.themoviedb.org/3';
  imageBase = 'https://image.tmdb.org/t/p/w500';

  // to get the id of the movie
  ngOnInit() {
    const id = +this.route.snapshot.params['id'] || 0;
    if (!id) {
      this.error = 'Invalid movie id';
      this.loading = false;
      return;
    }

    // to set the id of the movie
    this.svc.id.set(id);

    this.loadAll(id);
  }

  // to load the details, videos, and recommendations
  private async loadAll(id: number) {
    try {
      this.loading = true;
      this.error = null;

      const detailsUrl = `${this.apiBase}/movie/${id}?api_key=${this.tmdbKey}&language=en-US`;
      const videosUrl = `${this.apiBase}/movie/${id}/videos?api_key=${this.tmdbKey}&language=en-US`;
      const recUrl = `${this.apiBase}/movie/${id}/recommendations?api_key=${this.tmdbKey}&language=en-US&page=1`;

      const [dRes, vRes, rRes] = await Promise.all([
        fetch(detailsUrl),
        fetch(videosUrl),
        fetch(recUrl),
      ]);

      if (!dRes.ok) throw new Error('Failed to fetch movie details');
      if (!vRes.ok) throw new Error('Failed to fetch videos');
      if (!rRes.ok) throw new Error('Failed to fetch recommendations');

      const detailsJson = await dRes.json();
      const videosJson = await vRes.json();
      const recJson = await rRes.json();

      this.film = detailsJson as IDetails;

      // see youtbe trailer if found
      if (videosJson.results && Array.isArray(videosJson.results)) {
        const trailer = videosJson.results.find(
          (v: any) =>
            v.site?.toLowerCase() === 'youtube' &&
            (v.type?.toLowerCase() === 'trailer' || v.type?.toLowerCase() === 'teaser')
        );
        this.trailerKey = trailer ? trailer.key : null;
      }

      // set first 6 recommendation if found 
      if (recJson.results && Array.isArray(recJson.results)) {
        this.recommendations = (recJson.results as IMovie[]).slice(0, 6);
      }
    } catch (err: any) {
      console.error(err);
      this.error = err?.message || 'An error occurred';
    } finally {
      this.loading = false;
    }
  }

  // set the minutes to hours and minutes format
  formatRuntime(mins: number | null | undefined) {
    if (!mins) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
