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

export interface SearchMovieResponse {
    page?: number;
    results?: Array<SearchMovieResponseResults>;
    total_pages?: number;
    total_results?: number;
};

export const searchMovie = (query: SearchMovieQuery): Promise<SearchMovieResponse> => {
    return useGet(`https://api.themoviedb.org/3/search/movie`, query)
}