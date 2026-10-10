'use client'

import { useId, useState, type ReactNode } from 'react'

type Props = {
  nombre: string
  tipo: string
  cartas: readonly string[]
  icono: ReactNode
  tono: number
}

export function TarjetaBebida({ nombre, tipo, cartas, icono, tono }: Props) {
  const [modo, setModo] = useState<'cerrada' | 'hover' | 'fija'>('cerrada')
  const abierta = modo !== 'cerrada'
  const detalleId = useId()

  return (
    <li
      className="trago-card carta-bebida"
      data-tono={tono}
      data-open={abierta}
      onPointerEnter={(evento) => {
        if (evento.pointerType === 'mouse') {
          setModo((actual) => actual === 'cerrada' ? 'hover' : actual)
        }
      }}
      onPointerLeave={(evento) => {
        if (evento.pointerType === 'mouse') {
          setModo((actual) => actual === 'hover' ? 'cerrada' : actual)
        }
      }}
    >
      <span className="carta-bebida__icono" aria-hidden="true">{icono}</span>
      <h3 className="trago-card__titulo">
        <button
          type="button"
          className="trago-card__boton"
          aria-label={`${abierta ? 'Ocultar' : 'Ver'} detalles de ${nombre}`}
          aria-expanded={abierta}
          aria-controls={detalleId}
          onClick={() => setModo((actual) => actual === 'fija' ? 'cerrada' : 'fija')}
          onKeyDown={(evento) => {
            if (evento.key === 'Escape') setModo('cerrada')
          }}
        >
          <span className="trago-card__nombre">{nombre}</span>
          <span className="trago-card__mas" aria-hidden="true">+</span>
        </button>
      </h3>
      <div className="trago-card__info" id={detalleId} aria-hidden={!abierta}>
        <p className="trago-card__base">{tipo}</p>
        <p className="trago-card__descripcion">Disponible en {cartas.join(', ')}.</p>
      </div>
    </li>
  )
}
