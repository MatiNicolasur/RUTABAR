import Link from 'next/link'
import { Icono } from '@/components/Icono'

const INCLUIDO = [
  { icono: '19', titulo: 'Barra libre y equipo', texto: 'Tu carta sin límite de pedidos, atendida por bartenders.' },
  { icono: '4', titulo: 'Cristalería', texto: 'Copas y vasos de vidrio para cada trago.' },
  { icono: '22', titulo: 'Todos los insumos', texto: 'Hielo, mixers, cítricos y hierbas frescas.' },
  { icono: '33', titulo: 'Montaje y desmontaje', texto: 'Dejamos todo listo y retiramos al terminar.' },
]

export function SistemaServicio() {
  return (
    <div className="servicio-carta">
      <div className="carta-marco servicio-carta__marco">
        <ul className="carta-lista servicio-carta__lista">
          {INCLUIDO.map((item) => (
            <li className="trago servicio-carta__item" key={item.titulo}>
              <span className="trago__icono" aria-hidden="true">
                <Icono nombre={item.icono} tamano={44} />
              </span>
              <div className="trago__cuerpo">
                <div className="trago__cabecera">
                  <h3 className="trago__nombre">{item.titulo}</h3>
                </div>
                <p className="trago__descripcion">{item.texto}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="servicio-carta__extras">
          <div className="bloque-titulo">
            <h3>Lo coordinamos contigo</h3>
            <span className="regla" aria-hidden="true" />
          </div>
          <p className="servicio-carta__nota">
            Carta, duración, traslado y condiciones del recinto se confirman antes de reservar.{' '}
            <Link className="enlace" href="/condiciones">Revisa las condiciones</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
