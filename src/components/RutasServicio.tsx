import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { CONFIG_COTIZACION, type CartaCotizacionId } from '@/data/precios-cotizacion'

const RUTAS = [
  {
    id: 'reducida',
    nombre: 'Ruta Esencial',
    dato: '10 opciones · 5 horas',
    bajada: '7 bebidas originales + 3 mocktails',
    detalle: 'Cerveza, vino tinto, vino blanco, Mojito, Gin Tonic, Pisco Sour, Vodka Tropical y tres mocktails. Agua incluida.',
    imagen: '/fotos/pack-ruta-esencial-movil.jpg',
    imagenAlt: 'Mojito sobre una barra móvil negra en un cumpleaños de patio con invitados y luces rojas',
  },
  {
    id: 'completa',
    nombre: 'Ruta Full',
    dato: '25 opciones · 5 horas',
    bajada: 'La experiencia completa',
    detalle: 'Cócteles clásicos y de autor, cerveza, vinos, bebidas, jugos, agua y alternativas sin alcohol.',
    imagen: '/fotos/pack-ruta-full-movil.jpg',
    imagenAlt: 'Cócteles sobre una barra móvil negra en un matrimonio al aire libre con luces rojas',
  },
  {
    id: 'sin-alcohol',
    nombre: 'Ruta Zero',
    dato: '9 opciones · 5 horas',
    bajada: 'La experiencia sin alcohol',
    detalle: 'Cuatro mocktails, bebidas, jugos, agua y preparaciones refrescantes para todos los invitados.',
    imagen: '/fotos/pack-ruta-zero-movil.jpg',
    imagenAlt: 'Mocktails sobre una barra móvil negra en un cumpleaños de patio con luces rojas',
  },
] as const

const formatoPrecio = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })

export function RutasServicio() {
  return (
    <section className="seccion rutas-servicio" aria-labelledby="titulo-rutas-servicio">
      <div className="lienzo">
        <div className="seccion__encabezado rutas-servicio__encabezado">
          <p className="micro">Servicios</p>
          <h2 className="h2" id="titulo-rutas-servicio">Elige tu ruta.</h2>
          <p className="lead">Tres packs de barra libre por cinco horas o una ruta flexible para elegir la carta y duración de tu evento.</p>
        </div>

        <div className="rutas-servicio__grid">
          {RUTAS.map((ruta) => (
            <article className="rutas-servicio__card" key={ruta.nombre}>
              <div className="rutas-servicio__foto" style={{ '--ruta-imagen': `url(${ruta.imagen})` } as CSSProperties}>
                <Image src={ruta.imagen} alt={ruta.imagenAlt} fill sizes="(min-width: 78rem) 25vw, (min-width: 42rem) 50vw, 100vw" />
                <span className="rutas-servicio__foto-dato">{ruta.dato}</span>
              </div>
              <div className="rutas-servicio__cuerpo">
                <h3>{ruta.nombre}</h3>
                <p className="rutas-servicio__bajada">{ruta.bajada}</p>
                <p className="rutas-servicio__detalle">{ruta.detalle}</p>
                <div className="rutas-servicio__pie">
                  <p className="rutas-servicio__precio">{formatoPrecio.format(CONFIG_COTIZACION.cartas.find((carta) => carta.id === ruta.id)!.precios[5])}<span>40 personas · 5 horas · IVA incluido</span></p>
                  <Link className="rutas-servicio__accion" href={`/cotizar?pack=${ruta.id satisfies CartaCotizacionId}`} aria-label={`Cotizar ${ruta.nombre} para mi evento`}>
                    Cotizar esta ruta <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <article className="rutas-servicio__card rutas-servicio__card--personalizada">
            <div className="rutas-servicio__personalizada-arte" aria-hidden="true">ruta<span>bar</span></div>
            <div className="rutas-servicio__cuerpo">
              <p className="rutas-servicio__dato">A tu medida</p>
              <h3>La carta y las horas que tú quieras</h3>
              <p className="rutas-servicio__bajada">Elige tu propia ruta</p>
              <p className="rutas-servicio__detalle">Escoge una de nuestras tres cartas y ajusta la barra libre entre 3 y 12 horas según tu evento.</p>
              <div className="rutas-servicio__pie">
                <p className="rutas-servicio__precio">Precio según tu selección<span>40 a 300 personas · IVA incluido</span></p>
                <Link className="rutas-servicio__accion rutas-servicio__accion--personalizada" href="/cotizar?modo=flexible">
                  Armar mi ruta <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
