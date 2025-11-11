import env from './env'
import { defineNuxtConfig } from 'nuxt/config'

const { baseUrlProxy, baseUrl } = env

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            ...env,
        },
    },
    // 关闭自动导入组件的路径前缀
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
    // 自动导入关闭
    imports: {
        dirs: ['components'],
        scan: false,
    },
    nitro: {
        // 客户端代理
        devProxy: {
            [baseUrlProxy]: {
                target: baseUrl + baseUrlProxy,
                changeOrigin: true,
            },
        },
        minify: true,
        // 是否进行gzip/br压缩
        compressPublicAssets: true,
    },
    // 服务端代理
    routeRules: {
        [`${ baseUrlProxy }/**`]: { proxy: `${ baseUrl + baseUrlProxy }/**` },
    },
    devServer: {
        // 生成局域网链接
        // host: '0.0.0.0',
        // 避免在开发环境使用localhost启动超慢（要转好几分钟），0000在windows上无法使用
        host: '127.0.0.1',
    },
    experimental: {
        // 关闭客户端定时更新检查
        appManifest: false,
        checkOutdatedBuildInterval: false,
        // 避免 Cannot stringify arbitrary non-POJOs
        renderJsonPayloads: false,
        // 降低出现Nuxt instance is unavailable错误的可能性
        asyncContext: true,
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@nuxt/test-utils']
})