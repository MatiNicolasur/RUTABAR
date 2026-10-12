import Image from 'next/image'
import Link from 'next/link'

const RUTAS = [
  {
    nombre: 'Ruta Esencial',
    dato: '10 opciones · 5 horas',
    bajada: '7 bebidas originales + 3 mocktails',
    detalle: 'Cerveza, vino tinto, vino blanco, Mojito, Gin Tonic, Pisco Sour, Vodka Tropical y tres mocktails. Agua incluida.',
    imagen: '/tragos/mojito.webp',
    imagenAlt: 'Mojito con lima y menta servido en vaso alto',
    href: '/cotizar?carta=reducida&horas=5',
  },
  {
    nombre: 'Ruta Full',
    dato: '25 opciones · 5 horas',
    bajada: 'La experiencia completa',
    detalle: 'Cócteles clásicos y de autor, cerveza, vinos, bebidas, jugos, agua y alternativas sin alcohol.',
    imagen: '/fotos/cocteles-editorial.webp',
    imagenAlt: 'Cócteles de RUTABAR preparados para un evento',
    href: '/cotizar?carta=completa&horas=5',
  },
  {
    nombre: 'Ruta Zero',
    dato: '9 opciones · 5 horas',
    bajada: 'La experiencia sin alcohol',
    detalle: 'Cuatro mocktails, bebidas, jugos, agua y preparaciones refrescantes para todos los invitados.',
    imagen: '/tragos/mocktail-tropical.webp',
    imagenAlt: 'Mocktail tropical servido con fruta fresca',
    href: '/cotizar?carta=sin-alcohol&horas=5',
  },
] as const

export function RutasServicio() {
  return (
    <section className="seccion rutas-servicio" aria-labelledby="titulo-rutas-servicio">
      <div className="lienzo">
        <div className="seccion__encabezado rutas-servicio__encabezado">
          <p className="micro">Servicios</p>
          <h2 className="h2" id="titulo-rutas-servicio">Elige tu ruta.</h2>
          <p className="lead">Cuatro formas de llevar la barra libre a tu evento. Las cinco horas son el punto de partida; puedes ajustar la duración al cotizar.</p>
        </div>

        <div className="rutas-servicio__grid">
          {RUTAS.map((ruta) => (
            <article className="rutas-servicio__card" key={ruta.nombre}>
              <div className="rutas-servicio__foto">
                <Image src={ruta.imagen} alt={ruta.imagenAlt} fill sizes="(min-width: 78rem) 25vw, (min-width: 42rem) 50vw, 100vw" />
              </div>
              <div className="rutas-servicio__cuerpo">
                <p className="rutas-servicio__dato">{ruta.dato}</p>
                <h3>{ruta.nombre}</h3>
                <p className="rutas-servicio__bajada">{ruta.bajada}</p>
                <p className="rutas-servicio__detalle">{ruta.detalle}</p>
                <Link className="rutas-servicio__accion" href={ruta.href} aria-label={`Cotizar ${ruta.nombre} para mi evento`}>
                  Cotizar esta ruta <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}

          <article className="rutas-servicio__card rutas-servicio__card--personalizada">
            <div className="rutas-servicio__personalizada-arte" aria-hidden="true">ruta<span>bar</span></div>
            <div className="rutas-servicio__cuerpo">
              <p className="rutas-servicio__dato">A tu medida</p>
              <h3>Carta personalizada</h3>
              <p className="rutas-servicio__bajada">Una ruta hecha para tu evento</p>
              <p className="rutas-servicio__detalle">Cuéntanos qué tragos quieres incluir y preparamos una propuesta según tus invitados, lugar y presupuesto.</p>
              <Link className="rutas-servicio__accion rutas-servicio__accion--personalizada" href="/cotizar?personalizada=1&horas=5">
                Cotizar carta personalizada <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
