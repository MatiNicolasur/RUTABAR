import Image from 'next/image'
import Link from 'next/link'
import { ParallaxScroll } from './ParallaxScroll'

/**
 * Carrusel de lugares.
 *
 * Los dos sitios de referencia usan el mismo recurso: una banda de fotos que
 * se recorre en horizontal para mostrar variedad sin gastar altura de página.
 * Acá se resuelve con `scroll-snap` nativo, sin una línea de JavaScript:
 *
 * - **Es scroll de verdad.** Rueda, trackpad, dedo y las flechas del teclado
 *   cuando el contenedor tiene foco. Un carrusel con `transform` controlado
 *   por JS rompe las cuatro cosas y además secuestra el gesto.
 * - **Todas las fotos están en el documento.** Se piden de a una con
 *   `loading="lazy"`, pero existen para lectores de pantalla y para el
 *   buscador desde el primer render.
 * - **La primera pieza se ve cortada a propósito.** Un carrusel que ocupa
 *   todo el ancho no se lee como desplazable.
 */

type Lugar = {
  src: string
  alt: string
  titulo: string
  texto: string
}

const LUGARES: Lugar[] = [
  {
    src: 'barra-jardin',
    alt: 'Barra móvil de RUTABAR montada en un jardín, con sombrilla de flecos y pampas en floreros de vidrio',
    titulo: 'Jardines y casas',
    texto:
      'El caso más común. La barra entra en un espacio reducido y no necesita cocina ni una esquina especial.',
  },
  {
    src: 'barra-hora-dorada',
    alt: 'Barra blanca de RUTABAR con copas alineadas y flores blancas, montada a la hora dorada',
    titulo: 'Terrazas y quinchos',
    texto: 'Montamos sobre lo que ya existe: si hay una superficie firme, hay barra.',
  },
  {
    src: 'barra-sombrilla',
    alt: 'Barra de RUTABAR sobre el pasto con sombrilla a rayas y arreglo floral, antes de que lleguen los invitados',
    titulo: 'Patios y piscinas',
    texto:
      'Al aire libre sumamos sombra y protegemos el hielo. Es el montaje donde más cambia la logística.',
  },
  {
    src: 'dispensadores',
    alt: 'Cuatro dispensadores de vidrio con mocktails etiquetados sobre la barra, bajo una sombrilla',
    titulo: 'Salones y oficinas',
    texto: 'Interiores y eventos de empresa: llegamos, montamos y desmontamos sin dejar rastro.',
  },
]

export function CarruselLugares() {
  return (
    <div className="carrusel">
      <ul
        className="carrusel__pista"
        tabIndex={0}
        role="group"
        aria-label="Lugares donde montamos la barra. Desplázate en horizontal para ver todos."
      >
        {LUGARES.map((lugar) => (
          <li className="carrusel__pieza" key={lugar.src}>
            <div className="carrusel__media">
              <ParallaxScroll className="carrusel__parallax">
                <Image
                  src={`/fotos/${lugar.src}.jpg`}
                  alt={lugar.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 62rem) 30vw, 78vw"
                  className="carrusel__foto"
                />
              </ParallaxScroll>
            </div>
            <p className="carrusel__titulo">{lugar.titulo}</p>
            <p className="carrusel__texto">{lugar.texto}</p>
          </li>
        ))}
      </ul>

      <p className="carrusel__pie">
        ¿Tu evento no calza en ninguna?{' '}
        <Link className="enlace" href="/cotizar">
          Cuéntanos dónde es
        </Link>{' '}
        y lo revisamos.
      </p>
    </div>
  )
}
