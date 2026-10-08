/**
 * Datos del negocio en un solo lugar, para metadata, datos estructurados y
 * textos legales.
 *
 * El nombre y el dominio siguen pendientes de decisión: `RUTABAR` es el nombre
 * de trabajo. Cuando se cierre el definitivo, se cambia acá y se propaga a
 * títulos, Open Graph, sitemap y datos estructurados.
 */

export const SITIO = {
  nombre: 'RUTABAR',
  url: process.env.NEXT_PUBLIC_SITIO_URL ?? 'https://rutabar.cl',
  descripcion:
    'Barra móvil con servicio de barra libre para eventos en Santiago de Chile. 13 cócteles, 4 mocktails, cristalería, montaje y cotización por escrito antes de reservar.',
  ciudad: 'Santiago',
  region: 'Región Metropolitana',
  pais: 'CL',
  telefono: process.env.NEXT_PUBLIC_WHATSAPP ?? '',
  email: process.env.NEXT_PUBLIC_EMAIL ?? 'contacto@rutabar.cl',
} as const

export const PALABRAS_CLAVE = [
  'barra móvil',
  'barra móvil Santiago',
  'coctelería para eventos',
  'bartender para eventos',
  'cocteleria eventos Santiago',
  'mocktails',
  'barra sin alcohol',
  'catering de cócteles',
  'barra para matrimonios',
  'barra para eventos corporativos',
]

/**
 * Datos estructurados del negocio.
 *
 * Se declara como `FoodEstablishment` con `areaServed` en vez de inventar una
 * dirección exacta: la cobertura todavía no está definida, y publicar una
 * dirección falsa en datos estructurados es peor que no publicar ninguna.
 */
export function datosEstructurados() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': `${SITIO.url}/#negocio`,
    name: SITIO.nombre,
    description: SITIO.descripcion,
    url: SITIO.url,
    image: `${SITIO.url}/og.jpg`,
    priceRange: '$$',
    servesCuisine: 'Cócteles',
    currenciesAccepted: 'CLP',
    paymentAccepted: 'Transferencia, efectivo',
    areaServed: {
      '@type': 'City',
      name: SITIO.ciudad,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITIO.ciudad,
        addressRegion: SITIO.region,
        addressCountry: SITIO.pais,
      },
    },
    ...(SITIO.telefono ? { telephone: SITIO.telefono } : {}),
    email: SITIO.email,
  }
}
