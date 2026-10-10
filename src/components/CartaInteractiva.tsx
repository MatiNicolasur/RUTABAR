import {
  ALTERNATIVAS_CARTA,
  BEBIDAS_Y_AGUA,
  CARTA_WEB,
} from '@/data/carta-web'
import { CartaFiltro } from './CartaFiltro'
import { TarjetaTrago } from './TarjetaTrago'
import Image from 'next/image'

/** La carta se compone en el servidor; cada tarjeta maneja su apertura en el cliente. */
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
