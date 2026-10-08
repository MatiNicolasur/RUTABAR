import type { CSSProperties } from 'react'
import { Icono } from './Icono'

/**
 * Confeti de iconos de marca sobre la foto de la carta.
 *
 * Cuando la sección entra en pantalla, los dibujos entran disparados desde
 * fuera de los dos costados y **quedan dispersos** sobre la foto.
 *
 * Dos cosas que son la trampa de este efecto y conviene no volver a pisar:
 *
 * 1. **Las posiciones se miden contra la foto, no contra el icono.** Un
 *    `translate` con porcentaje se resuelve sobre el tamaño del propio elemento
 *    —el icono— y no sobre el contenedor. Con porcentajes, ocho iconos de 60px
 *    se mueven todos lo mismo y quedan amontonados en el mismo lugar. Por eso
 *    acá cada pieza se posiciona con `cqw`/`cqh`, que son unidades del
 *    contenedor: así el desparramo es proporcional a la foto en cualquier
 *    tamaño de pantalla.
 * 2. **El destino es un lugar concreto de la foto.** Cada pieza declara dónde
 *    aterriza (`--x`, `--y`) y desde qué costado entra (`--lado`). La entrada
 *    arranca a 130 unidades de contenedor fuera del borde, o sea siempre fuera
 *    de cuadro, sin depender del ancho de la ventana.
 *
 * El contenedor de la foto declara `container-type: inline-size` en
 * `confeti.css`: sin eso, `cqw` no resuelve.
 */

type Pieza = {
  icono: string
  /** Posición final dentro de la foto, en porcentaje de su ancho y su alto. */
  x: number
  y: number
  /** Giro final, en grados. */
  giro: number
  /** Tamaño relativo al de la pieza base. */
  escala: number
  /** Costado por el que entra. */
  lado: -1 | 1
  retraso: number
}

const PIEZAS: Pieza[] = [
  { icono: '18', x: 14, y: 18, giro: -22, escala: 1, lado: -1, retraso: 0 },
  { icono: '19', x: 33, y: 52, giro: 16, escala: 1.15, lado: -1, retraso: 80 },
  { icono: '12', x: 20, y: 78, giro: -12, escala: 0.85, lado: -1, retraso: 160 },
  { icono: '25', x: 45, y: 34, giro: 28, escala: 0.72, lado: -1, retraso: 240 },
  { icono: '6', x: 72, y: 26, giro: 24, escala: 1.1, lado: 1, retraso: 50 },
  { icono: '22', x: 58, y: 58, giro: -18, escala: 0.95, lado: 1, retraso: 130 },
  { icono: '17', x: 80, y: 74, giro: 12, escala: 0.8, lado: 1, retraso: 210 },
  { icono: '27', x: 66, y: 44, giro: -26, escala: 0.68, lado: 1, retraso: 290 },
]

type Props = {
  /** Tamaño base de cada icono, en unidades de contenedor. */
  tamano?: number
}

export function Confeti({ tamano = 6 }: Props) {
  return (
    <div className="confeti" aria-hidden="true">
      {PIEZAS.map((pieza, indice) => (
        <span
          className="confeti__pieza"
          key={`${pieza.icono}-${indice}`}
          style={
            {
              '--x': `${pieza.x}cqw`,
              '--y': `${pieza.y}cqh`,
              '--giro': `${pieza.giro}deg`,
              '--escala': pieza.escala,
              '--lado': pieza.lado,
              '--retraso': `${pieza.retraso}ms`,
              '--tam': `${(tamano * pieza.escala).toFixed(2)}cqw`,
            } as CSSProperties
          }
        >
          <Icono nombre={pieza.icono} tamano={64} />
        </span>
      ))}
    </div>
  )
}
