'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import type { TragoWeb } from '@/data/carta-web'

const PERFIL: Record<TragoWeb['perfil'], string> = {
  burbujeante: 'Burbujeante',
  citrico: 'Cítrico',
  dulce: 'Dulce',
  seco: 'Seco',
  herbal: 'Herbal',
}

export function TarjetaTrago({ trago }: { trago: TragoWeb }) {
  const [modo, setModo] = useState<'cerrada' | 'hover' | 'fija'>('cerrada')
  const abierta = modo !== 'cerrada'
  const detalleId = useId()

  return (
    <li
      className="trago-card"
      data-trago={trago.id}
      data-familia={trago.familia}
      data-perfil={trago.perfil}
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
      <Image
        src={trago.imagen}
        alt={`${trago.nombre} servido en ${trago.vaso}.`}
        fill
        sizes="(min-width: 78rem) 25vw, (min-width: 62rem) 33vw, 45vw"
        className="trago-card__imagen"
      />

      <h3 className="trago-card__titulo">
        <button
          type="button"
          className="trago-card__boton"
          aria-label={`${abierta ? 'Ocultar' : 'Ver'} detalles de ${trago.nombre}`}
          aria-expanded={abierta}
          aria-controls={detalleId}
          onClick={() => setModo((actual) => actual === 'fija' ? 'cerrada' : 'fija')}
          onKeyDown={(evento) => {
            if (evento.key === 'Escape') setModo('cerrada')
          }}
        >
          <span className="trago-card__nombre">{trago.nombre}</span>
          <span className="trago-card__mas" aria-hidden="true">+</span>
        </button>
      </h3>

      <div className="trago-card__info" id={detalleId} aria-hidden={!abierta}>
        <p className="trago-card__base">{trago.base}</p>
        <p className="trago-card__descripcion">{trago.descripcion}</p>
        <p className="trago-card__ficha">
          {PERFIL[trago.perfil]} · {trago.vaso}<br />{trago.garnish}
        </p>
      </div>
    </li>
  )
}
