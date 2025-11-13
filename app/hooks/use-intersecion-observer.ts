export const useIntersectionObserver = ({
    element,
    options = {},
    callback = () => { },
}: {
    element?: Ref<HTMLDivElement | undefined>,
    options?: IntersectionObserverInit,
    callback?: () => void,
}) => {
    let observer: IntersectionObserver | null = null

    const setupObserver = () => {
        if (observer) {
            observer.disconnect()
        }
        if (!element?.value) return
        observer = new IntersectionObserver(
            (entries) => {
                if (entries?.[0]?.isIntersecting) {
                    callback()
                }
            }, Object.assign({
                threshold: 1.0
            }, options)
        )
        observer.observe(element.value)
    }
    onMounted(() => {
        setupObserver()
    })

    watch(() => element?.value, () => {
        setupObserver()
    })

    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
        }
    })
}