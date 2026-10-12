import type { Metadata } from 'next'

/** Datos públicos del negocio en un solo lugar para SEO y datos estructurados. */

export const SITIO = {
  nombre: 'RUTABAR',
  url: process.env.NEXT_PUBLIC_SITIO_URL ?? 'https://rutabar.cl',
  descripcion:
    'Barra móvil y barra libre para eventos en Santiago de Chile. Packs de cócteles, mocktails y servicio atendido para celebraciones y empresas.',
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
  'coctelería eventos Santiago',
  'mocktails',
  'barra sin alcohol',
  'catering de cócteles',
  'barra para matrimonios',
  'barra para eventos corporativos',
]

export function metadataPagina(titulo: string, descripcion: string, ruta: string): Metadata {
  const tituloSocial = `${titulo} · ${SITIO.nombre}`
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: 'website',
      locale: 'es_CL',
      siteName: SITIO.nombre,
      url: ruta,
      title: tituloSocial,
      description: descripcion,
      images: [
        {
          url: '/og.jpg',
          width: 1200,
          height: 630,
          alt: 'RUTABAR, barra móvil de coctelería para eventos en Santiago',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloSocial,
      description: descripcion,
      images: ['/og.jpg'],
    },
  }
}

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
