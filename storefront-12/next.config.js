/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['']
    },
    i18n: {
        // locales: ['en', 'es', 'zh'],
        locales: ['es'],
        defaultLocale: 'es',
    },
    // output: 'standalone',
}

module.exports = nextConfig
