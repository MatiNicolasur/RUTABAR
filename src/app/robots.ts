import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // El cotizador es una herramienta interna: no debe indexarse.
        disallow: ['/cotizador'],
      },
    ],
    sitemap: 'https://rutabar.cl/sitemap.xml',
  }
}
