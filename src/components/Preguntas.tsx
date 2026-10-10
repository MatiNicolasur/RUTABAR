import Link from 'next/link'

/**
 * Preguntas frecuentes.
 *
 * Los dos sitios de referencia cierran con una sección de preguntas, y no es
 * casualidad: es lo último que se interpone entre el interés y la cotización.
 * Acá están escritas respondiendo lo que el modelo de costos y las condiciones
 * ya dicen —el mínimo, el traslado, la carta cerrada— en vez de preguntas
 * decorativas.
 *
 * Se resuelve con `<details>`, que es un disclosure nativo: funciona con
 * teclado, con lector de pantalla y sin JavaScript. La primera va abierta para
 * que se entienda que se puede abrir.
 */

type Pregunta = {
  pregunta: string
  respuesta: string
  abierta?: boolean
}

const PREGUNTAS: Pregunta[] = [
  {
    pregunta: '¿Qué significa barra libre?',
    respuesta:
      'Durante las horas contratadas, tus invitados pueden pedir libremente cualquiera de las preparaciones incluidas en la carta acordada. No se cobra cada bebida por separado.',
    abierta: true,
  },
  {
    pregunta: '¿Cómo se calcula el precio?',
    respuesta:
      'Depende de la carta, la duración de 3 a 12 horas y los asistentes. Para 40 personas, el cotizador muestra las tarifas de cada alternativa; otros tamaños se calculan proporcionalmente.',
  },
  {
    pregunta: '¿Puedo poner yo el alcohol?',
    respuesta:
      'Se puede acordar. En ese caso nosotros ponemos la operación —bartender, cristalería, hielo, mixers, guarniciones y montaje— y tú provees las botellas, con una lista que te pasamos antes. La modalidad y las autorizaciones del recinto se validan al cotizar.',
  },
  {
    pregunta: '¿Qué pasa si necesito la barra una hora más?',
    respuesta:
      'Se cotiza aparte y no como tarifa plana, porque una hora más no es solo una hora de reloj: es personal adicional, más consumo y más transporte. Si lo sabes antes de reservar, queda en la cotización inicial.',
  },
  {
    pregunta: '¿Puedo cambiar la carta el mismo día?',
    respuesta:
      'No. La carta queda cerrada al reservar, y es lo que permite comprar los insumos exactos y cortar la guarnición el mismo día. Cambiar la selección antes de la reserva no tiene costo.',
  },
  {
    pregunta: '¿Y si todavía no tengo la fecha?',
    respuesta:
      'Se puede cotizar igual. La fecha se confirma al pagar el abono; hasta entonces la cotización es un documento con precios vigentes, no una reserva.',
  },
  {
    pregunta: '¿Emiten factura para empresas?',
    respuesta:
      'Sí. Podemos emitir factura y el pago sigue el esquema 50% para reservar y 50% el día del evento. Si tu empresa necesita otra condición, la acordamos por escrito antes de reservar.',
  },
]

export function Preguntas() {
  return (
    <div className="faq">
      <div className="faq__lista">
        {PREGUNTAS.map((item) => (
          <details className="faq__item" key={item.pregunta} open={item.abierta}>
            <summary className="faq__pregunta">{item.pregunta}</summary>
            <p className="faq__respuesta">{item.respuesta}</p>
          </details>
        ))}
      </div>

      <p className="faq__pie">
        ¿Quedó algo sin responder?{' '}
        <Link className="enlace" href="/condiciones">
          Está todo en las condiciones
        </Link>{' '}
        o lo vemos en la cotización, con precio al lado.
      </p>
    </div>
  )
}
