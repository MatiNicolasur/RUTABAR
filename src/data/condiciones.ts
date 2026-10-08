import { PAGO } from './pago'

export type BloqueCondiciones = {
  id: string
  titulo: string
  puntos: string[]
}

export const CONDICIONES: BloqueCondiciones[] = [
  {
    id: 'incluye',
    titulo: 'Qué incluye',
    puntos: [
      'Barra acordada y montaje en el lugar del evento.',
      'Bartender según la demanda declarada del evento.',
      'Cristalería suficiente, hielo, mixers, insumos y guarniciones.',
      'El suministro de alcohol depende de la modalidad contractual que se valide.',
    ],
  },
  {
    id: 'carta',
    titulo: 'Carta',
    puntos: [
      'La carta queda cerrada al momento de la reserva.',
      'La barra libre incluye las bebidas y preparaciones detalladas en la cotización.',
      'No incluye marcas ni preparaciones fuera de la alternativa acordada.',
    ],
  },
  {
    id: 'traslado',
    titulo: 'Traslado y cobertura',
    puntos: [
      'Traslado incluido únicamente dentro del sector definido en la cotización.',
      'Fuera de ese sector se cotizan kilómetros, peajes y horas adicionales.',
      'La comuna y el sector cubierto se confirman antes de reservar.',
    ],
  },
  {
    id: 'hora-extra',
    titulo: 'Hora extra',
    puntos: [
      'Se cotiza por separado según personal, consumo y traslado.',
      'La tarifa de horas adicionales se confirma en la cotización del evento.',
    ],
  },
  {
    id: 'pago',
    titulo: 'Pago y cambios',
    puntos: [
      PAGO.resumen,
      'Confirmación escrita con condiciones de cambio y devolución antes del abono.',
      'Los eventos corporativos pagan antes de prestar el servicio.',
    ],
  },
]
