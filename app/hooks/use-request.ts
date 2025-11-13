import type { UseFetchOptions } from '#app'
import type { FetchContext } from 'ofetch'

const onRequest = async (request: FetchContext) => {
    const { token } = useRuntimeConfig().public
    if (token) {
        request.options.headers.set('Authorization', `Bearer ${ token }`)
    }
}
const onRequestError = (result: FetchContext) => { }
const onResponse = (result: FetchContext) => { }
const onResponseError = async (result: FetchContext) => {
    const { status } = result.response || {}
}

export const useRequest = async <T>(url: string, options?: UseFetchOptions<T>) => {
    const { baseUrl } = useRuntimeConfig().public
    const _url = url
    const _baseUrl = baseUrl

    const isNeedJoin = _url.startsWith('/')
    const finalUrl = isNeedJoin ? _baseUrl + _url : _url

    if (!options) options = {}
    if (!options.headers) options.headers = {}
    if (!options.onRequest) options.onRequest = onRequest
    if (!options.onRequestError) options.onRequestError = onRequestError
    if (!options.onResponse) options.onResponse = onResponse
    if (!options.onResponseError) options.onResponseError = onResponseError

    if (!options.timeout) options.timeout = 10000

    if (import.meta.browser) {
        return await $fetch<T>(finalUrl, options as any)
    } else {
        const { data } = await useFetch(finalUrl, options)
        return data.value!
    }
}

export const useGet = <T = {}>(
    url: string,
    params?: {
        params?: any
        [key: string]: any
    },
    options?: UseFetchOptions<T>,
) => {
    if (!options) options = {}
    if (params) options.params = params
    if (params?.params) options.params = params.params
    options.method = 'GET'

    return useRequest<T>(url, options)
}
export const usePost = <T = {}>(url: string, body?: {}, options?: UseFetchOptions<T>) => {
    if (!options) options = {}
    if (body) options.body = body
    options.method = 'POST'

    return useRequest<T>(url, options)
}
