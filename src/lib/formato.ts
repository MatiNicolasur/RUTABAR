/** Formato de montos y porcentajes en es-CL. */

const CLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const NUMERO = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 })

const PORCENTAJE = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function clp(monto: number): string {
  return CLP.format(Math.round(monto))
}

export function numero(valor: number): string {
  return NUMERO.format(valor)
}

/** `0.0846` -> `"8,5%"` */
export function pct(fraccion: number): string {
  return `${PORCENTAJE.format(fraccion * 100)}%`
}

/** `-0.0846` -> `"-8,5%"` */
export function pctConSigno(fraccion: number): string {
  const formateado = PORCENTAJE.format(Math.abs(fraccion) * 100)
  const signo = fraccion > 0 ? '+' : fraccion < 0 ? '−' : ''
  return `${signo}${formateado}%`
}

/** `2` -> `"2 h"`, `2.5` -> `"2,5 h"` */
export function horas(valor: number): string {
  return `${valor.toLocaleString('es-CL', { maximumFractionDigits: 1 })} h`
}
