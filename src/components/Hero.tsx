'use client'

/**
 * Hero con cortina de columnas sobre la fotografía.
 *
 * Dos decisiones que se apartan del arquetipo original, y por qué:
 *
 * 1. La cortina cubre SOLO la foto, no el texto. El arquetipo deja el titular
 *    escondido detrás de las columnas, lo que retrasa el LCP alrededor de un
 *    segundo entero. Acá el texto se pinta desde el primer frame y la cortina
 *    revela la imagen por detrás: el mismo gesto, sin el costo en Core Web
 *    Vitals.
 *
 * 2. Las columnas son del rojo de marca, no del color del papel. El arquetipo
 *    pide igualarlas al fondo para que la cortina no se note; acá el rojo es
 *    intencional: el sitio abre como un campo rojo con el titular encima y la
 *    fotografía aparece después. Como el texto tiene que leerse sobre los dos
 *    fondos, el blanco cálido funciona en ambos.
 *
 * En `retrato`, el preloader espera la foto y da paso a las animaciones CSS.
 * Con `prefers-reduced-motion: reduce` se omite el movimiento espacial.
 */

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useId, useState, type CSSProperties } from 'react'
import { Icono } from './Icono'
import { ParallaxScroll } from './ParallaxScroll'

type Accion = { label: string; href: string }

/**
 * Dos composiciones para el mismo contenido:
 *
 * - `cortina` — fotografía a sangre, cortina de columnas al cargar. Es la
 *   versión que prioriza la foto y el titular grande.
 * - `retrato` — sobre rojo hondo: un rectángulo vertical muy redondeado con la
 *   foto adentro, el dibujo de marca en grande por detrás y el nombre en
 *   escritura manuscrita encima. Prioriza la marca por sobre la foto.
 */
type Diseno = 'cortina' | 'retrato'

type Props = {
  imagen: string
  /** Texto alternativo real: la foto muestra el servicio, no es decoración. */
  imagenAlt: string
  kicker?: string
  lineas: string[]
  /** Frase corta en tipografía manuscrita, debajo del titular. */
  mano?: string
  lead?: string
  accion?: Accion
  accionSecundaria?: Accion
  nota?: string
  /** Columnas de la cortina. Más de 8 se lee como ruido. */
  segmentos?: number
  diseno?: Diseno
  /** Solo para `retrato`: firma manuscrita que sobresale de la foto. */
  marca?: string
  /** Solo para `retrato`: ubicación bajo la firma, dentro de la foto. */
  ubicacion?: string
}

export function Hero({
  imagen,
  imagenAlt,
  kicker,
  lineas,
  mano,
  lead,
  accion,
  accionSecundaria,
  nota,
  segmentos = 6,
  diseno = 'cortina',
  marca = 'RUTABAR',
  ubicacion,
}: Props) {
  const titleId = useId()
  const [fotoLista, setFotoLista] = useState(false)
  const [pausaCompleta, setPausaCompleta] = useState(false)
  const [faseEntrada, setFaseEntrada] = useState<'espera' | 'sale' | 'hero'>('espera')
  const fraseRetrato = lineas.join(' ')
  const columnas = Array.from(
    { length: Math.max(2, Math.min(10, segmentos)) },
    (_, indice) => indice,
  )

  useEffect(() => {
    if (diseno !== 'retrato') return

    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pausa = window.setTimeout(() => setPausaCompleta(true), movimientoReducido ? 200 : 2450)
    const respaldo = window.setTimeout(() => setFotoLista(true), 5000)

    return () => {
      window.clearTimeout(pausa)
      window.clearTimeout(respaldo)
    }
  }, [diseno])

  useEffect(() => {
    if (diseno === 'retrato' && faseEntrada === 'espera' && fotoLista && pausaCompleta) {
      setFaseEntrada('sale')
    }
  }, [diseno, faseEntrada, fotoLista, pausaCompleta])

  useEffect(() => {
    if (faseEntrada !== 'sale') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFaseEntrada('hero')
      return
    }

    const respaldo = window.setTimeout(() => setFaseEntrada('hero'), 1050)
    return () => window.clearTimeout(respaldo)
  }, [faseEntrada])

  const contenido = (
    <div className="lienzo hero__contenido">
      <div className="hero__texto">
        {kicker ? (
          <p className="hero__kicker hero__paso" style={{ '--i': 1 } as CSSProperties}>
            {kicker}
          </p>
        ) : null}

        <h1 className="hero__titulo" id={titleId}>
          {lineas.map((linea) => (
            <span className="hero__linea" key={linea}>
              <span className="hero__lineaInt">{linea}</span>
            </span>
          ))}
        </h1>

        {mano ? <p className="hero__mano">{mano}</p> : null}

        <div className="hero__pie">
          {lead ? (
            <p className="hero__lead hero__paso" style={{ '--i': 2 } as CSSProperties}>
              {lead}
            </p>
          ) : null}

          <div className="hero__acciones">
            {accion ? (
              <Link
                className="boton hero__cta"
                href={accion.href}
                style={{ '--i': 3 } as CSSProperties}
              >
                {accion.label}
              </Link>
            ) : null}
            {accionSecundaria ? (
              <Link
                className="boton boton--fantasma hero__cta"
                href={accionSecundaria.href}
                style={{ '--i': 3 } as CSSProperties}
              >
                {accionSecundaria.label}
              </Link>
            ) : null}
          </div>
        </div>

        {nota ? <p className="hero__nota">{nota}</p> : null}
      </div>

      {/* El dibujo de marca, al costado del titular. Es la persona con la copa
       * en mano: la misma figura del sello, en grande, para que el hero tenga
       * la marca dibujada y no solo escrita. Va en su propia columna y
       * alineado con el titular —no con el pie— para que no se cruce con los
       * botones. Decorativa, por eso `aria-hidden`. */}
      <span
        className="hero__figura hero__paso"
        aria-hidden="true"
        style={{ '--i': 3 } as CSSProperties}
      >
        <Icono nombre="31" tamano={560} />
      </span>
    </div>
  )

  if (diseno === 'retrato') {
    return (
      <>
        {faseEntrada !== 'hero' ? (
          <div
            className={`hero2__preloader${faseEntrada === 'sale' ? ' hero2__preloader--saliendo' : ''}`}
            role="status"
            aria-label="el mejor bar móvil en santiago de chile"
            onTransitionEnd={(evento) => {
              if (evento.target === evento.currentTarget && evento.propertyName === 'transform') {
                setFaseEntrada('hero')
              }
            }}
          >
            <p>
              <span>el mejor bar móvil</span>
              <span>en santiago de chile</span>
            </p>
          </div>
        ) : null}
        <section
          className={`hero hero--retrato${faseEntrada === 'hero' ? ' hero--playing' : ''}`}
          aria-labelledby={titleId}
          inert={faseEntrada !== 'hero'}
        >
        {/* El dibujo de marca, gigante, centrado y en el rojo de marca: es el
         * fondo de la composición. Va suelto dentro del hero y no dentro del
         * rectángulo, porque el recorte redondeado se lo comería. */}
        <span className="hero2__figura" aria-hidden="true">
          <Icono nombre="31" tamano={420} />
        </span>

        {/* La foto conserva su marco original. El texto queda como capa aparte
         * para poder extenderse un poco más allá de los bordes de la imagen. */}
        <div className="hero2__marco">
          <div className="hero2__media">
            <ParallaxScroll className="hero2__parallax">
              <Image
                src={imagen}
                alt={imagenAlt}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 62rem) 34rem, 88vw"
                className="hero2__foto"
                onLoad={() => setFotoLista(true)}
                onError={() => setFotoLista(true)}
              />
            </ParallaxScroll>
          </div>

          <div className="hero2__texto">
            <h1 className="solo-lectores" id={titleId}>{fraseRetrato}</h1>
            <p className="hero2__firma mano">{marca}</p>
            {ubicacion ? <p className="hero2__ubicacion mano">{ubicacion}</p> : null}
          </div>
        </div>

        <div className="hero2__intro">
          {lead ? <p>{lead}</p> : null}
          <div className="fila">
            {accion ? <Link className="boton boton--claro" href={accion.href}>{accion.label}</Link> : null}
            {accionSecundaria ? <Link className="boton boton--fantasma" href={accionSecundaria.href}>{accionSecundaria.label}</Link> : null}
          </div>
        </div>
        </section>
      </>
    )
  }

  return (
    <section
      className="hero"
      aria-labelledby={titleId}
      style={{ '--hero-segmentos': columnas.length } as CSSProperties}
    >
      <div className="hero__media">
        <ParallaxScroll className="hero__parallax">
          <Image
            src={imagen}
            alt={imagenAlt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="hero__foto"
          />
        </ParallaxScroll>
      </div>

      <div className="hero__cortina" aria-hidden="true">
        {columnas.map((indice) => (
          <span className="hero__panel" key={indice} style={{ '--i': indice } as CSSProperties} />
        ))}
      </div>

      <div className="hero__velo" aria-hidden="true" />

      {contenido}
    </section>
  )
}
