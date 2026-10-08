import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import './globals.css'
import '@/components/chrome.css'
import '@/components/hero.css'
import '@/components/contenido.css'
import '@/components/interactivo.css'
import '@/components/ranura.css'
import '@/components/confeti.css'
import '@/components/sistema.css'
import '@/components/estimador.css'
import '@/components/cotizador.css'
import '@/components/cotizacion.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PALABRAS_CLAVE, SITIO, datosEstructurados } from '@/lib/seo'

/**
 * Montserrat lleva todo el texto y los titulares; Mairo se reserva para los
 * acentos manuscritos. Van por separado a propósito: Mairo es una tipografía
 * de trazo hecho a mano, y usarla en párrafos o titulares largos la vuelve
 * ilegible.
 */
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
})

const mairo = localFont({
  src: '../fonts/mairo.woff',
  display: 'swap',
  variable: '--font-mairo',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: `${SITIO.nombre} — Barra móvil de coctelería para eventos en Santiago`,
    template: `%s · ${SITIO.nombre}`,
  },
  description: SITIO.descripcion,
  keywords: PALABRAS_CLAVE,
  applicationName: SITIO.nombre,
  authors: [{ name: SITIO.nombre }],
  creator: SITIO.nombre,
  publisher: SITIO.nombre,
  alternates: { canonical: '/' },
  category: 'food',
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: SITIO.nombre,
    url: SITIO.url,
    title: `${SITIO.nombre} — Barra móvil de coctelería para eventos en Santiago`,
    description: SITIO.descripcion,
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
    title: `${SITIO.nombre} — Barra móvil de coctelería para eventos`,
    description: SITIO.descripcion,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: false, address: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fffbfa' },
    { media: '(prefers-color-scheme: dark)', color: '#8a0019' },
  ],
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${montserrat.variable} ${mairo.variable}`}>
      <body>
        <a className="saltar" href="#contenido">
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          // Datos estructurados del negocio. El contenido es de confianza:
          // sale de src/lib/seo.ts, no de entrada del usuario.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados()) }}
        />
      </body>
    </html>
  )
}
