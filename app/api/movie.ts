import { useGet } from "~/hooks/use-request"

export interface SearchMovieQuery {
    query: string
    include_adult?: boolean
    language?: string
    primary_release_year?: string
    page?: number
    region?: string
    year?: string
}

export interface SearchMovieResponseResults {
    adult?: boolean;
    backdrop_path?: string;
    genre_ids?: Array<number>;
    id?: number;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    release_date?: Date;
    title?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
};

export type SearchMovieResponseMergeResults = SearchMovieResponseResults & {
    isStar?: boolean
}

export interface SearchMovieResponse {
    page?: number;
    results?: Array<SearchMovieResponseMergeResults>;
    total_pages?: number;
    total_results?: number;
};

export interface GetMovieDetailResponse {
    adult?: boolean;
    backdrop_path?: string;
    belongs_to_collection?: any;
    budget?: number;
    genres?: Array<GetMovieDetailResponseGenres>;
    homepage?: string;
    id?: number;
    imdb_id?: string;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    production_companies?: Array<GetMovieDetailResponseProductionCompanies>;
    production_countries?: Array<GetMovieDetailResponseProductionCountries>;
    release_date?: Date;
    revenue?: number;
    runtime?: number;
    spoken_languages?: Array<GetMovieDetailResponseSpokenLanguages>;
    status?: string;
    tagline?: string;
    title?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
};

export interface GetMovieDetailResponseGenres {
    id?: number;
    name?: string;
};

export interface GetMovieDetailResponseProductionCompanies {
    id?: number;
    logo_path?: string;
    name?: string;
    origin_country?: string;
};

export interface GetMovieDetailResponseProductionCountries {
    iso_3166_1?: string;
    name?: string;
};

export interface GetMovieDetailResponseSpokenLanguages {
    english_name?: string;
    iso_639_1?: string;
    name?: string;
};

export const searchMovie = (query: SearchMovieQuery): Promise<SearchMovieResponse> => {
    return useGet(`/search/movie`, query)
}

export const getMovieDetail = (movieId: number): Promise<GetMovieDetailResponse> => {
    return useGet(`/movie/${ movieId }`)
}