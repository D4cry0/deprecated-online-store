/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/admin',
    reactStrictMode: true,
    images: {
        domains: ['']
    },
    i18n: {
        locales: ['en', 'es', 'zh'],
        defaultLocale: 'es',
    },
    output: 'standalone',
}

module.exports = nextConfig
