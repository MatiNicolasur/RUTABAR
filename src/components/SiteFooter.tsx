import Link from 'next/link'
import { Sello } from './Sello'
import { SITIO } from '@/lib/seo'

export function SiteFooter() {

  return (
    <footer className="pie">
      <div className="lienzo pie__interior">
        <div className="pie__marca">
          {/* Igual que en la cabecera: el sello ya es el nombre, así que no se
           * repite al lado. El pie se queda con lo que el sello no dice. */}
          <Sello tamano={104} className="pie__sello" />
          <p className="pie__bajada">
            Barra móvil de coctelería para eventos.
            <br />
            Santiago de Chile.
          </p>
        </div>

        <nav className="pie__nav" aria-label="Navegación de pie de página">
          <p className="micro">Sitio</p>
          <Link href="/servicios">Servicios</Link>
          <Link href="/carta">Carta</Link>
          <Link href="/condiciones">Condiciones</Link>
          <Link href="/cotizar">Cotizar mi evento</Link>
        </nav>

        <div className="pie__notas">
          <p className="micro">Contacto</p>
          <p>
            Escríbenos a{' '}
            <a href={`mailto:${SITIO.email}`}>{SITIO.email}</a>
            {SITIO.telefono ? (
              <>
                {' '}
                o por{' '}
                <a
                  href={`https://wa.me/${SITIO.telefono.replace(/\D/g, '')}`}
                  rel="noopener"
                  target="_blank"
                >
                  WhatsApp
                </a>
              </>
            ) : null}
            .
          </p>

          <p>Precios de referencia con IVA incluido. Confirma carta, traslado, disponibilidad y valor final en tu cotización.</p>
        </div>
      </div>

      <div className="lienzo pie__legal">
        <p>
          {new Date().getFullYear()} · Precios en pesos chilenos con IVA incluido. Los servicios con
          alcohol se confirman después de validar las autorizaciones aplicables al recinto.
        </p>
        <p>
          Imágenes de coctelería y montaje ilustrativas.
        </p>
      </div>
    </footer>
  )
}
