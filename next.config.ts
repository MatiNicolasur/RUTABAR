import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/cotizaciones': ['./public/carta-pdf/*.jpg', './public/carta-pdf/*.png', './public/carta-pdf/*.ttf', './public/carta-pdf/iconos/*.png'],
  },
}

export default nextConfig
