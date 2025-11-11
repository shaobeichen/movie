import outerUrl from "~/utils/outer-url"

type NavigateToOptions = Parameters<typeof navigateTo>[1]

/**
 * 跳转链接
 * @param url 链接
 * @example useLinkTo('/account', { replace: true })
 */
export const useLinkTo = (url: string, options?: NavigateToOptions) => {
    if (outerUrl(url)) {
        return navigateTo(url, {
            open: {
                target: '_blank',
            },
        })
    } else {
        return navigateTo(url, options)
    }
}
