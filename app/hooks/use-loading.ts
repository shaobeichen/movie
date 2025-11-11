import { ElLoading, type LoadingInstance } from 'element-plus'

let loading: LoadingInstance | null = null

export function useLoading() {
    if (import.meta.server) {
        return {
            openLoading: () => { },
            closeLoading: () => { },
        }
    }

    const closeLoading = () => {
        if (loading) loading.close()
    }
    const openLoading = () => {
        loading = ElLoading.service({ fullscreen: true, lock: true })
    }

    return {
        openLoading,
        closeLoading,
    }
}
