import type { MetadataRoute } from 'next'
import { SITIO } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: new URL('/sitemap.xml', SITIO.url).toString(),
  }
}
