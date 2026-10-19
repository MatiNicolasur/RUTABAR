import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { qualities: [65, 75] },
  outputFileTracingIncludes: {
    '/api/cotizaciones': ['./public/carta-pdf/*.png', './public/carta-pdf/*.ttf', './public/carta-pdf/iconos/*.png'],
  },
}

export default nextConfig
