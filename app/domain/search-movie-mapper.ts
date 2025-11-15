import { objectKeys } from "~/utils/object";
import { isArray, isDate, isBoolean, isNumber, isString, isObject } from "~/utils/types";

export class SearchMovieModel {
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
    isStar?: boolean;

    private static readonly typeMap = {
        adult: 'boolean',
        backdrop_path: 'string',
        genre_ids: 'array',
        id: 'number',
        original_language: 'string',
        original_title: 'string',
        overview: 'string',
        popularity: 'number',
        poster_path: 'string',
        release_date: 'date',
        title: 'string',
        video: 'boolean',
        vote_average: 'number',
        vote_count: 'number',
        isStar: 'boolean'
    } as const;

    static getExpectedType<K extends keyof SearchMovieModel>(key: K): string {
        return this.typeMap[key];
    }
}

// 简易适配器模式
export const searchMovieModelMapper = (source: SearchMovieModel): SearchMovieModel => {
    const target = new SearchMovieModel();
    if (!source || !isObject(source)) {
        return target
    }
    const result = new SearchMovieModel();
    objectKeys(target).forEach((key) => {
        const expectedType = SearchMovieModel.getExpectedType(key);
        switch (expectedType) {
            case 'array':
                if (!isArray(source[key])) (result as Record<string, unknown>)[key] = [];
                (result as Record<string, unknown>)[key] = source[key];
                break;
            case 'date':
                if (!isDate(source[key])) (result as Record<string, unknown>)[key] = '';
                (result as Record<string, unknown>)[key] = source[key];
                break;
            case 'boolean':
                if (!isBoolean(source[key])) (result as Record<string, unknown>)[key] = false;
                (result as Record<string, unknown>)[key] = source[key];
                break;
            case 'number':
                if (!isNumber(source[key])) (result as Record<string, unknown>)[key] = 0;
                (result as Record<string, unknown>)[key] = source[key];
                break;
            case 'string':
                if (!isString(source[key])) (result as Record<string, unknown>)[key] = '';
                (result as Record<string, unknown>)[key] = source[key];
                break;
            case 'object':
                if (!isObject(source[key])) (result as Record<string, unknown>)[key] = {};
                (result as Record<string, unknown>)[key] = source[key];
                break;
            default:
                (result as Record<string, unknown>)[key] = source[key];
                break;
        }
    })

    return result
}