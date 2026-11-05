'use client'

import { useId, useState, type ReactNode } from 'react'
import type { FamiliaTrago } from '@/data/carta-web'

type Resumen = { id: string; familia: FamiliaTrago }

type Props = {
  /** Solo lo necesario para contar: los tragos en sí llegan como `children`. */
  tragos: Resumen[]
  /** Las tarjetas, ya renderizadas en el servidor. */
  children: ReactNode
}

/**
 * Filtro de la carta.
 *
 * Las tarjetas llegan renderizadas desde el servidor y este componente solo
 * cambia dos atributos del contenedor; el filtrado real lo hace el CSS con
 * selectores de atributo. Es a propósito: si el filtro se resolviera en React,
 * los 35 iconos de marca —125 KB de trazados— tendrían que viajar al navegador
 * dentro del bundle. Así no viaja ninguno y el filtro es instantáneo.
 */
export function CartaFiltro({ tragos, children }: Props) {
  const [familia, setFamilia] = useState<FamiliaTrago | 'todas'>('todas')
  const id = useId()

  const visibles = tragos.filter((trago) => familia === 'todas' || trago.familia === familia).length

  const familias: { valor: FamiliaTrago | 'todas'; etiqueta: string }[] = [
    { valor: 'todas', etiqueta: `Todos (${tragos.length})` },
    {
      valor: 'con-alcohol',
      etiqueta: `Cócteles (${tragos.filter((trago) => trago.familia === 'con-alcohol').length})`,
    },
    {
      valor: 'sin-alcohol',
      etiqueta: `Mocktails (${tragos.filter((trago) => trago.familia === 'sin-alcohol').length})`,
    },
  ]

  return (
    <div
      className="carta-int"
      data-familia={familia}
      aria-labelledby={id}
    >
      <div className="carta-int__barra">
        {/* Botones con aria-pressed en vez de role="tablist": el patrón de
         * pestañas de ARIA exige navegación con flechas, y a medio implementar
         * es peor que no usarlo. */}
        <div className="carta-int__familias" role="group" aria-label="Categoría de tragos">
          {familias.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={familia === opcion.valor}
              className="carta-int__tab"
              onClick={() => setFamilia(opcion.valor)}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>

      </div>

      <p className="carta-int__cuenta" id={id} aria-live="polite">
        {visibles === 0
          ? 'Ningún trago combina con ese filtro.'
          : `${visibles} de ${tragos.length} tragos`}
      </p>

      <div className="carta-int__lista">{children}</div>
    </div>
  )
}
