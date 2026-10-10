import {
  ALTERNATIVAS_CARTA,
  BEBIDAS_Y_AGUA,
  CARTA_WEB,
  ETIQUETA_PERFIL,
  type TragoWeb,
} from '@/data/carta-web'
import { CartaFiltro } from './CartaFiltro'
import { ParallaxScroll } from './ParallaxScroll'
import Image from 'next/image'

/**
 * Ficha de un trago.
 *
 * Es un componente de servidor: el icono se renderiza acá y viaja como HTML,
 * nunca como datos al bundle del navegador.
 */
export function TarjetaTrago({ trago }: { trago: TragoWeb }) {
  return (
    <li
      className="trago"
      data-trago={trago.id}
      data-familia={trago.familia}
      data-perfil={trago.perfil}
    >
      <figure className="trago__foto">
        <ParallaxScroll className="trago__parallax">
          <Image
            src={trago.imagen}
            alt={`Fotografía ilustrativa de ${trago.nombre}`}
            fill
            sizes="(min-width: 62rem) 120px, 20vw"
            className="trago__fotoImagen"
          />
        </ParallaxScroll>
      </figure>

      <div className="trago__cuerpo">
        <div className="trago__cabecera">
          <h3 className="trago__nombre">{trago.nombre}</h3>
          <span className="trago__base">{trago.base}</span>
        </div>
        <p className="trago__descripcion">{trago.descripcion}</p>

        <div className="trago__meta">
          <span className="etiqueta">{ETIQUETA_PERFIL[trago.perfil]}</span>
          <span className="trago__ficha">
            {trago.vaso} · {trago.garnish}
          </span>
        </div>

      </div>
    </li>
  )
}

/** La carta completa, con su filtro. Todo se renderiza en el servidor. */
export function CartaInteractiva() {
  const resumen = CARTA_WEB.map((t) => ({ id: t.id, familia: t.familia, perfil: t.perfil }))

  return (
    <div className="carta-publica">
      <section className="carta-publica__alternativas" aria-labelledby="titulo-alternativas-carta">
        <div className="bloque-titulo">
          <h2 id="titulo-alternativas-carta">Elige tu ruta de tragos</h2>
          <span className="regla" aria-hidden="true" />
        </div>
        <p className="carta-publica__intro">Tres selecciones para elegir según tus invitados y presupuesto. La carta completa reúne todo lo que ves abajo; las otras dos incluyen solo las bebidas indicadas.</p>
        <div className="carta-publica__opciones">
          {ALTERNATIVAS_CARTA.map((opcion) => (
            <article className="carta-publica__opcion" key={opcion.nombre}>
              <p className="micro">{opcion.cantidad}</p>
              <h3>{opcion.nombre}</h3>
              <p>{opcion.detalle}</p>
            </article>
          ))}
        </div>
      </section>

      <CartaFiltro tragos={resumen}>
        <ul className="carta-lista">
          {CARTA_WEB.map((trago) => (
            <TarjetaTrago key={trago.id} trago={trago} />
          ))}
        </ul>
      </CartaFiltro>

      <section className="carta-publica__bebidas" aria-labelledby="titulo-bebidas-agua">
        <div className="bloque-titulo">
          <h2 id="titulo-bebidas-agua">Bebidas y agua</h2>
          <span className="regla" aria-hidden="true" />
        </div>
        <figure className="carta-publica__bebidas-foto">
          <Image
            src="/fotos/bebidas-agua.jpg"
            alt="Vasos de agua, jugo, bebidas, cerveza y vino sobre la cubierta de madera de una barra móvil"
            fill
            sizes="(min-width: 62rem) 54rem, 92vw"
            className="carta-publica__bebidas-imagen"
          />
        </figure>
        <ul className="carta-publica__etiquetas">
          {BEBIDAS_Y_AGUA.map((bebida) => <li key={bebida}>{bebida}</li>)}
        </ul>
      </section>

    </div>
  )
}
