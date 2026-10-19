import type { ReactNode } from 'react'
import type { Segmento } from '@/data/servicios'

type Props = {
  segmentos: Segmento[]
  /** Iconos ya renderizados en el servidor, para que no viajen como datos. */
  iconos: Record<string, ReactNode>
}

/**
 * Presenta tipos de evento como ejemplos, después de explicar el servicio.
 */
export function ServiciosInteractivos({ segmentos, iconos }: Props) {
  return (
    <div className="serv-int">
      <div className="serv-int__cards" aria-label="Tipos de evento que atendemos">
        {segmentos.map((opcion) => (
          <article className="serv-int__card" key={opcion.id}>
            <span className="serv-int__cardIcono" aria-hidden="true">{iconos[opcion.id]}</span>
            <h3 className="serv-int__cardTitulo">{opcion.nombre}</h3>
            <p className="serv-int__cardGancho">{opcion.gancho}</p>
            <p className="serv-int__cardTexto">{opcion.paraQuien}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
