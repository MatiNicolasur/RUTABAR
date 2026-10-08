import Link from 'next/link'
import { Icono } from '@/components/Icono'

const INCLUIDO = [
  { icono: '4', titulo: 'Cristalería de vidrio', texto: 'Copas y vasos para servir cada preparación.' },
  { icono: '19', titulo: 'Barra libre', texto: 'Pedidos libres de las bebidas incluidas en la carta acordada.' },
  { icono: '22', titulo: 'Hielo e insumos', texto: 'Mixers y bases para preparar la carta acordada.' },
  { icono: '17', titulo: 'Guarniciones frescas', texto: 'Cítricos y hierbas preparados el día del evento.' },
  { icono: '35', titulo: 'Bartender y apoyo', texto: 'Equipo dimensionado según invitados y servicio.' },
  { icono: '33', titulo: 'Montaje y desmontaje', texto: 'La barra queda lista antes y se retira al terminar.' },
]

const A_MEDIDA = [
  { titulo: 'Horas adicionales', texto: 'Se coordinan según la duración y disponibilidad del equipo.' },
  { titulo: 'Traslado', texto: 'La comuna y el valor se confirman antes de reservar.' },
  { titulo: 'Selección de carta', texto: 'Los cócteles y mocktails quedan definidos por escrito.' },
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
          <ul className="servicio-carta__lista-extra">
            {A_MEDIDA.map((item) => (
              <li key={item.titulo}>
                <strong>{item.titulo}</strong>
                <span>{item.texto}</span>
              </li>
            ))}
          </ul>
          <p className="servicio-carta__nota">
            Los servicios con alcohol están sujetos a validar las condiciones del recinto.{' '}
            <Link className="enlace" href="/condiciones">Revisa las condiciones</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
