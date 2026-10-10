import type { Metadata } from 'next'
import Link from 'next/link'
import { CondicionesBloques } from '@/components/CondicionesBloques'
import { Reveal } from '@/components/Reveal'
import { PAGO } from '@/data/pago'

export const metadata: Metadata = {
  title: 'Condiciones',
  description:
    'Deja listo tu evento: carta, traslado, horarios, pago, cambios y devoluciones acordados por escrito.',
  alternates: { canonical: '/condiciones' },
}

export default function PaginaCondiciones() {

  return (
    <>
      <header className="pagina-cabecera">
        <div className="lienzo pagina-cabecera__interior">
          <p className="micro">Condiciones</p>
          <h1>Déjalo todo listo antes de tu evento.</h1>
          <p className="lead">Carta, horarios, traslado y pago quedan claros antes de reservar.</p>
        </div>
      </header>

      <section className="seccion" aria-label="Condiciones del servicio">
        <div className="lienzo">
          <CondicionesBloques />
        </div>
      </section>

      <section className="seccion seccion--papel-hondo" aria-labelledby="titulo-pago">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Pago</p>
            <h2 className="h2" id="titulo-pago">
              {PAGO.resumen}
            </h2>
            <p className="lead">{PAGO.detalle}</p>
          </div>

          <div className="rejilla rejilla--2">
            <Reveal className="condicion">
              <h3 className="condicion__titulo">Antes de pagar el abono</h3>
              <ul className="lista-marcada">
                <li>Recibes la cotización por escrito con el detalle de lo incluido.</li>
                <li>Recibes las condiciones de cambio y devolución.</li>
                <li>Confirmas la carta cerrada y la dirección exacta del evento.</li>
              </ul>
            </Reveal>

            <Reveal className="condicion" retraso={60}>
              <h3 className="condicion__titulo">Casos particulares</h3>
              <ul className="lista-marcada">
                <li>
                  <strong>Corporativos:</strong> emitimos factura y mantenemos el esquema 50/50 indicado en la cotización.
                </li>
                <li>
                  <strong>Catering y productoras:</strong> acuerdo por evento, según volumen y
                  repetición.
                </li>
                <li>
                  <strong>Cambios de fecha:</strong> sujetos a disponibilidad y a lo que diga la
                  cotización firmada.
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="seccion" aria-labelledby="titulo-confirmacion">
        <div className="lienzo seccion__encabezado">
          <p className="micro">Antes de reservar</p>
          <h2 className="h2" id="titulo-confirmacion">Confirma el lugar y la modalidad.</h2>
          <p className="lead">La cotización indica el traslado, la carta, la duración y quién aporta el alcohol. Los servicios con alcohol están sujetos a la validación de las autorizaciones aplicables al recinto.</p>
        </div>
      </section>

      <section className="seccion seccion--tinta">
        <div className="lienzo">
          <div className="cierre">
            <div className="pila">
              <p className="micro">¿Dudas antes de cotizar?</p>
              <h2 className="h2">Conversemos los detalles de tu evento.</h2>
              <p className="lead">Revisamos juntos cualquier punto antes de confirmar la reserva.</p>
            </div>
            <div className="cierre__acciones">
              <Link className="boton" href="/cotizar">
                Cotizar mi evento
              </Link>
            </div>
          </div>


        </div>
      </section>
    </>
  )
}
