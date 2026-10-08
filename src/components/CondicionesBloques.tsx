import { CONDICIONES } from '@/data/condiciones'
import { Reveal } from './Reveal'

type Props = {
  /** Limita a los primeros bloques, para resúmenes. */
  limite?: number
}

export function CondicionesBloques({ limite }: Props) {
  const bloques = typeof limite === 'number' ? CONDICIONES.slice(0, limite) : CONDICIONES

  return (
    <div className="rejilla rejilla--2">
      {bloques.map((bloque, indice) => (
        <Reveal className="condicion" key={bloque.id} retraso={(indice % 2) * 60}>
          <h3 className="condicion__titulo">{bloque.titulo}</h3>
          <ul className="lista-marcada">
            {bloque.puntos.map((punto) => (
              <li key={punto}>{punto}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  )
}
