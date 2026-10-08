import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Segmento } from '@/data/servicios'

type Props = {
  segmentos: Segmento[]
  /** Iconos ya renderizados en el servidor, para que no viajen como datos. */
  iconos: Record<string, ReactNode>
}

/**
 * Presenta los tres tipos de evento como referencias visuales, no como opciones.
 * La modalidad y las variables de cotización son comunes y se explican una vez.
 */
export function ServiciosInteractivos({ segmentos, iconos }: Props) {
  return (
    <div className="serv-int">
      <div className="serv-int__cards" aria-label="Tipos de evento que atendemos">
        {segmentos.map((opcion) => (
          <article className="serv-int__card" key={opcion.id}>
            <span className="serv-int__cardIcono" aria-hidden="true">{iconos[opcion.id]}</span>
            <p className="micro">{opcion.criterio}</p>
            <h3 className="serv-int__cardTitulo">{opcion.nombre}</h3>
            <p className="serv-int__cardGancho">{opcion.gancho}</p>
            <p className="serv-int__cardTexto">{opcion.paraQuien}</p>
          </article>
        ))}
      </div>

      <section className="serv-int__comun" aria-label="Modalidad y cotización">
        <dl className="serv-int__ficha">
          <div>
            <dt>Modalidad</dt>
            <dd>Barra libre durante las horas contratadas.</dd>
          </div>
          <div>
            <dt>Se cotiza</dt>
            <dd>La carta, la cantidad de horas, los asistentes y el lugar del evento.</dd>
          </div>
        </dl>

        <div className="fila">
          <Link className="boton" href="/cotizar">Cotizar mi evento</Link>
        </div>
      </section>
    </div>
  )
}
