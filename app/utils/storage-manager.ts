import type { SearchMovieResponseMergeResults } from "~/api/movie"

export function getTodoStorage(): SearchMovieResponseMergeResults[] {
    return JSON.parse(localStorage.getItem('todo') || '[]') || []
}

export function setTodoStorage(todo: SearchMovieResponseMergeResults[]) {
    localStorage.setItem('todo', JSON.stringify(todo))
}

export function clearTodoStorage() {
    localStorage.removeItem('todo')
}