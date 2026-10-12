/**
 * Tarifas públicas con IVA para 40 personas. Edita esta tabla o `personasBase`
 * para actualizar los precios sin tocar la interfaz.
 */
export const CONFIG_COTIZACION = {
  personasBase: 40,
  asistentesMin: 20,
  asistentesMax: 300,
  duraciones: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const,
  cartas: [
    {
      id: 'sin-alcohol',
      nombre: 'Ruta Zero',
      bebidas: 9,
      resumen: '4 mocktails, Coca-Cola, jugo, Sprite, otra bebida sin alcohol y agua.',
      precios: { 3: 372_000, 4: 416_000, 5: 460_000, 6: 504_000, 7: 544_000, 8: 588_000, 9: 632_000, 10: 676_000, 11: 716_000, 12: 760_000 },
    },
    {
      id: 'reducida',
      nombre: 'Ruta Esencial',
      bebidas: 10,
      resumen: 'Cerveza, vino tinto, vino blanco, 4 cócteles y 3 mocktails a elección. Agua incluida.',
      precios: { 3: 444_000, 4: 500_000, 5: 548_000, 6: 600_000, 7: 648_000, 8: 696_000, 9: 744_000, 10: 796_000, 11: 844_000, 12: 892_000 },
    },
    {
      id: 'completa',
      nombre: 'Ruta Full',
      bebidas: 25,
      resumen: '13 cócteles, 4 mocktails y 8 bebidas entre cerveza, vinos, refrescos, jugo y agua.',
      precios: { 3: 532_000, 4: 600_000, 5: 656_000, 6: 712_000, 7: 768_000, 8: 828_000, 9: 884_000, 10: 936_000, 11: 992_000, 12: 1_048_000 },
    },
  ],
} as const

export type DuracionCotizacion = (typeof CONFIG_COTIZACION.duraciones)[number]
export type CartaCotizacionId = (typeof CONFIG_COTIZACION.cartas)[number]['id']

export function asistentesEnRango(asistentes: number): boolean {
  return Number.isSafeInteger(asistentes)
    && asistentes >= CONFIG_COTIZACION.asistentesMin
    && asistentes <= CONFIG_COTIZACION.asistentesMax
}

export function calcularPrecioCotizacion(
  cartaId: CartaCotizacionId,
  duracion: DuracionCotizacion,
  asistentes: number,
): number {
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === cartaId)
  if (!carta || !asistentesEnRango(asistentes)) return 0

  return Math.round((carta.precios[duracion] * asistentes) / CONFIG_COTIZACION.personasBase)
}
