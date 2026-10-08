import type { MetadataRoute } from 'next'

const BASE = 'https://rutabar.cl'

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date()
  return [
    { url: `${BASE}/`, lastModified: ahora, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/servicios`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/carta`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/condiciones`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/cotizar`, lastModified: ahora, changeFrequency: 'monthly', priority: 1 },
  ]
}
