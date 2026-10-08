/**
 * Tarifas públicas del cotizador. Edita esta tabla o `personasBase` para
 * actualizar los precios sin tocar la interfaz ni el cotizador interno.
 */
export const CONFIG_COTIZACION = {
  personasBase: 40,
  duraciones: [2, 4, 6] as const,
  cartas: [
    {
      id: 'sin-alcohol',
      nombre: 'Solo sin alcohol',
      bebidas: 9,
      precios: { 2: 332_000, 4: 420_000, 6: 504_000 },
    },
    {
      id: 'reducida',
      nombre: 'Barra reducida',
      bebidas: 7,
      precios: { 2: 420_000, 4: 544_000, 6: 648_000 },
    },
    {
      id: 'completa',
      nombre: 'Carta completa',
      bebidas: 25,
      precios: { 2: 464_000, 4: 600_000, 6: 712_000 },
    },
  ],
} as const

export type DuracionCotizacion = (typeof CONFIG_COTIZACION.duraciones)[number]
export type CartaCotizacionId = (typeof CONFIG_COTIZACION.cartas)[number]['id']

export function calcularPrecioCotizacion(
  cartaId: CartaCotizacionId,
  duracion: DuracionCotizacion,
  asistentes: number,
): number {
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === cartaId)
  if (!carta || !Number.isSafeInteger(asistentes) || asistentes < 1) return 0

  return Math.round((carta.precios[duracion] * asistentes) / CONFIG_COTIZACION.personasBase)
}
