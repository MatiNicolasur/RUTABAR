import Image from 'next/image'
import Link from 'next/link'
import { CONFIG_COTIZACION, type CartaCotizacionId } from '@/data/precios-cotizacion'
import { Sello } from './Sello'

const HORAS_PACK = 5

const RUTAS = [
  {
    id: 'reducida',
    bajada: 'Clásicos para celebrar',
    incluye: [
      'Mojito, Gin Tonic, Pisco Sour y Vodka Tropical',
      'Cerveza, vino tinto y vino blanco',
      'Tres mocktails y agua incluida',
    ],
    imagen: '/fotos/pack-ruta-esencial-movil.jpg',
    imagenAlt: 'Mojito sobre una barra móvil negra en un cumpleaños de patio con invitados y luces rojas',
  },
  {
    id: 'completa',
    bajada: 'La experiencia completa',
    incluye: [
      '13 cócteles clásicos y de autor',
      'Cuatro mocktails',
      'Cerveza, vinos, bebidas, jugos y agua',
    ],
    imagen: '/fotos/pack-ruta-full-movil.jpg',
    imagenAlt: 'Cócteles sobre una barra móvil negra en un matrimonio al aire libre con luces rojas',
  },
  {
    id: 'sin-alcohol',
    bajada: 'La experiencia sin alcohol',
    incluye: [
      'Cuatro mocktails',
      'Bebidas y jugos',
      'Agua y preparaciones refrescantes',
    ],
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
          <p className="lead">Barra libre para tu evento. Elige un pack de cinco horas o ajusta la carta y duración.</p>
        </div>

        <div className="rutas-servicio__grid">
          {RUTAS.map((ruta) => {
            const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === ruta.id)!
            const tituloId = `titulo-pack-${ruta.id}`
            return (
              <article className="rutas-servicio__card" key={ruta.id} aria-labelledby={tituloId}>
                <div className="rutas-servicio__foto">
                  <Image src={ruta.imagen} alt={ruta.imagenAlt} fill sizes="(min-width: 82rem) 360px, (min-width: 64rem) 30vw, (min-width: 48rem) 35vw, 100vw" />
                </div>
                <div className="rutas-servicio__cuerpo">
                  <h3 id={tituloId}>{carta.nombre}</h3>
                  <p className="rutas-servicio__datos">
                    <span>{carta.bebidas} opciones</span>
                    <span>{HORAS_PACK} horas</span>
                  </p>
                  <p className="rutas-servicio__bajada">{ruta.bajada}</p>
                  <ul className="rutas-servicio__incluye">
                    {ruta.incluye.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="rutas-servicio__pie">
                    <div className="rutas-servicio__precio">
                      <span>Para {CONFIG_COTIZACION.personasBase} personas · IVA incluido</span>
                      <strong>{formatoPrecio.format(carta.precios[HORAS_PACK])}</strong>
                    </div>
                    <Link className="rutas-servicio__accion" href={`/cotizar?pack=${ruta.id satisfies CartaCotizacionId}`}>
                      Cotizar {carta.nombre} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}

          <article className="rutas-servicio__card rutas-servicio__card--personalizada" aria-labelledby="titulo-pack-flexible">
            <div className="rutas-servicio__personalizada-arte" aria-hidden="true"><Sello tamano={180} /></div>
            <div className="rutas-servicio__cuerpo">
              <div className="rutas-servicio__intro">
                <p className="rutas-servicio__dato">A tu medida</p>
                <h3 id="titulo-pack-flexible">La carta y las horas que tú quieras</h3>
                <p className="rutas-servicio__datos">
                  <span>{CONFIG_COTIZACION.cartas.length} cartas</span>
                  <span>{CONFIG_COTIZACION.duraciones[0]} a {CONFIG_COTIZACION.duraciones.at(-1)} horas</span>
                </p>
                <p className="rutas-servicio__detalle">Escoge tu carta favorita y la duración de la barra libre. Nosotros nos encargamos de servir.</p>
              </div>
              <div className="rutas-servicio__pie">
                <div className="rutas-servicio__precio">
                  <span>{CONFIG_COTIZACION.asistentesMin} a {CONFIG_COTIZACION.asistentesMax} personas · IVA incluido</span>
                  <strong>Precio según tu selección</strong>
                </div>
                <Link className="rutas-servicio__accion rutas-servicio__accion--personalizada" href="/cotizar?modo=flexible">
                  Elegir carta y horas <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
