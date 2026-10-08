'use client'

import { useId, useState, type ReactNode } from 'react'
import { ETIQUETA_PERFIL, PERFILES, type FamiliaTrago, type PerfilTrago } from '@/data/carta-web'

type Resumen = { id: string; familia: FamiliaTrago; perfil: PerfilTrago }

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
  const [perfil, setPerfil] = useState<PerfilTrago | null>(null)
  const id = useId()

  const visibles = tragos.filter(
    (t) => (familia === 'todas' || t.familia === familia) && (!perfil || t.perfil === perfil),
  ).length

  const familias: { valor: FamiliaTrago | 'todas'; etiqueta: string }[] = [
    { valor: 'todas', etiqueta: `Toda la carta (${tragos.length})` },
    {
      valor: 'con-alcohol',
      etiqueta: `Con alcohol (${tragos.filter((t) => t.familia === 'con-alcohol').length})`,
    },
    {
      valor: 'sin-alcohol',
      etiqueta: `Sin alcohol (${tragos.filter((t) => t.familia === 'sin-alcohol').length})`,
    },
  ]

  return (
    <div
      className="carta-int"
      data-familia={familia}
      data-perfil={perfil ?? 'todos'}
      aria-labelledby={id}
    >
      <div className="carta-int__barra">
        {/* Botones con aria-pressed en vez de role="tablist": el patrón de
         * pestañas de ARIA exige navegación con flechas, y a medio implementar
         * es peor que no usarlo. */}
        <div className="carta-int__familias" role="group" aria-label="Familia de la carta">
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

        <div className="carta-int__perfiles" role="group" aria-label="Filtrar por perfil">
          <button
            type="button"
            className="carta-int__chip"
            aria-pressed={perfil === null}
            onClick={() => setPerfil(null)}
          >
            Todos los perfiles
          </button>
          {PERFILES.map((p) => (
            <button
              key={p}
              type="button"
              className="carta-int__chip"
              aria-pressed={perfil === p}
              onClick={() => setPerfil(perfil === p ? null : p)}
            >
              {ETIQUETA_PERFIL[p]}
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
