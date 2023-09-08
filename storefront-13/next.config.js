/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['']
    },
    i18n: {
        locales: ['en', 'es', 'zh'],
        defaultLocale: 'es',
    },
    // output: 'standalone',
}

module.exports = nextConfig
