import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
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
import '@/components/rutas-servicio.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PALABRAS_CLAVE, SITIO, datosEstructurados } from '@/lib/seo'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'

const GOOGLE_ANALYTICS_ID = 'G-WM1J2FQE7P'

/**
 * Archivo aporta los títulos de sección; Montserrat lleva los textos y Mairo
 * identifica las cabeceras de vista y los acentos manuscritos de la marca.
 */
const montserrat = localFont({
  src: '../fonts/montserrat-variable.ttf',
  display: 'swap',
  variable: '--font-montserrat',
  weight: '100 900',
})

const archivo = localFont({
  src: '../fonts/archivo-variable.woff2',
  display: 'swap',
  variable: '--font-archivo',
  weight: '100 900',
  style: 'normal',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
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
  themeColor: '#6d0002',
  viewportFit: 'cover',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CL"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${archivo.variable} ${mairo.variable}`}
    >
      <body>
        <div className="barra-safari" aria-hidden="true" />
        <a className="saltar" href="#contenido">
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <SpeedInsights />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
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
