import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Confeti } from './Confeti'
import { ParallaxScroll } from './ParallaxScroll'
import { Reveal } from './Reveal'

/**
 * Ranura de fotografía con texto al lado.
 *
 * Existe para que las diez fotos del branding se repartan a lo largo del sitio
 * en vez de amontonarse en una rejilla al final. Cada llamada es un bloque de
 * dos columnas: foto y texto, con la foto alternando de lado.
 *
 * Tres decisiones que vienen del material y no del gusto:
 *
 * 1. **La medida la manda la foto, no el contenedor.** Si la foto se estira a
 *    sangre en una franja ancha, el sujeto se pierde. Acá cada ranura declara
 *    su proporción y su ancho máximo, y la foto se recorta dentro de esa caja
 *    con `object-fit: cover`.
 * 2. **El punto de interés se declara.** Todas las fotos son verticales y el
 *    sujeto está en el tercio superior (la barra, la copa, las manos). Con
 *    `enfoque` se elige qué parte sobrevive al recorte; sin él, el centro
 *    geométrico suele cortar cabezas.
 * 3. **El encuadre se revela recortándose, no apareciendo.** La entrada usa
 *    `clip-path`, que no toca el layout ni pasa por `opacity`. Es la misma
 *    razón por la que el titular del hero nunca se anima con transparencia.
 */

type Medida = 'retrato' | 'cuadrado' | 'paisaje' | 'ancho'

type Props = {
  imagen: string
  imagenAlt: string
  /** Etiqueta corta sobre el titular. */
  micro?: string
  titulo: string
  /** Ancla del titular, para que la sección tenga nombre accesible. */
  id: string
  /** Proporción de la caja de la foto. */
  medida?: Medida
  /** Pone la foto a la izquierda en pantallas anchas. */
  invertida?: boolean
  /** `object-position` de la foto. El sujeto suele estar arriba: `center 38%`. */
  enfoque?: string
  /** Omite el optimizador de Next para assets que ya vienen optimizados. */
  sinOptimizacion?: boolean
  /** Frase corta en tipografía manuscrita. Una sola, no un párrafo. */
  mano?: string
  /** Dispara el confeti de iconos sobre la foto al entrar en pantalla. */
  confeti?: boolean
  accion?: { label: string; href: string }
  children?: ReactNode
}

export function Ranura({
  imagen,
  imagenAlt,
  micro,
  titulo,
  id,
  medida = 'retrato',
  invertida = false,
  enfoque,
  sinOptimizacion = false,
  mano,
  confeti = false,
  accion,
  children,
}: Props) {
  return (
    <section
      className={`ranura ranura--${medida}${invertida ? ' ranura--invertida' : ''}`}
      aria-labelledby={id}
    >
      <div className="lienzo ranura__interior">
        <Reveal className="ranura__media">
          <ParallaxScroll className="ranura__parallax">
            <Image
              src={imagen}
              alt={imagenAlt}
              fill
              sizes="(min-width: 62rem) 42vw, 92vw"
              className="ranura__foto"
              style={enfoque ? { objectPosition: enfoque } : undefined}
              unoptimized={sinOptimizacion}
            />
          </ParallaxScroll>
          {confeti ? <Confeti /> : null}
        </Reveal>

        <div className="ranura__cuerpo">
          {micro ? <p className="micro">{micro}</p> : null}
          <h2 className="h2 ranura__titulo" id={id}>
            {titulo}
          </h2>
          {mano ? <p className="mano ranura__mano">{mano}</p> : null}
          {children}
          {accion ? (
            <div className="fila ranura__accion">
              <Link className="boton boton--fantasma" href={accion.href}>
                {accion.label}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
