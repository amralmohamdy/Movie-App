export interface IDetails {
    adult: boolean;
    backdrop_path: string;

    belongs_to_collection: null;
    budget: number;

    genres: IGenrs[];
    homepage: string;
    id: number;
    imdb_id: string;

    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;

    production_companies: IProductionComapny[];
    production_countries: IProductionCountry[];
    release_date: string;
    revenue: number;
    runtime: number;

    spoken_languages: ISpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

interface IGenrs {
    id: number;
    name: string;
}

interface IProductionComapny {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string
}

interface IProductionCountry {
    iso_3166_1: string;
    name: string
}
interface ISpokenLanguage {
    english_name:string;
    iso_639_1: string;
    name: string
}