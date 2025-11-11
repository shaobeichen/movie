export const useSafeCall = async function (handler: () => Promise<any>, fallbackOrDefault: any) {
    if (typeof handler !== 'function') {
        throw new TypeError('handler must be a function')
    }

    let fallback = () => fallbackOrDefault

    if (typeof fallbackOrDefault === 'function') {
        fallback = fallbackOrDefault
    }

    try {
        return await handler()
    } catch (e) {
        console.error(`[useSafeCall - error] `, e)
        return fallback()
    }
}
