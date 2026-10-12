import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.rutabar.cl' }],
        destination: 'https://rutabar.cl/:path*',
        permanent: true,
      },
    ]
  },
  outputFileTracingIncludes: {
    '/api/cotizaciones': ['./public/carta-pdf/*.png', './public/carta-pdf/*.ttf', './public/carta-pdf/iconos/*.png'],
  },
}

export default nextConfig
