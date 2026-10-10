/**
 * Tarifas públicas con IVA para 40 personas. Edita esta tabla o `personasBase`
 * para actualizar los precios sin tocar la interfaz.
 */
export const CONFIG_COTIZACION = {
  personasBase: 40,
  duraciones: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const,
  cartas: [
    {
      id: 'sin-alcohol',
      nombre: 'Solo sin alcohol',
      bebidas: 9,
      resumen: '4 mocktails, refrescos y agua.',
      precios: { 3: 376_000, 4: 420_000, 5: 464_000, 6: 504_000, 7: 548_000, 8: 592_000, 9: 636_000, 10: 680_000, 11: 720_000, 12: 764_000 },
    },
    {
      id: 'reducida',
      nombre: 'Barra reducida',
      bebidas: 8,
      resumen: 'Cerveza, vinos, 4 cócteles y agua.',
      precios: { 3: 484_000, 4: 544_000, 5: 596_000, 6: 648_000, 7: 700_000, 8: 752_000, 9: 804_000, 10: 856_000, 11: 908_000, 12: 960_000 },
    },
    {
      id: 'completa',
      nombre: 'Carta completa',
      bebidas: 25,
      resumen: '13 cócteles, 4 mocktails y 8 bebidas y agua.',
      precios: { 3: 528_000, 4: 596_000, 5: 652_000, 6: 708_000, 7: 764_000, 8: 820_000, 9: 876_000, 10: 932_000, 11: 988_000, 12: 1_044_000 },
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
