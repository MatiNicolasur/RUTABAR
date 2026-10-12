import Link from 'next/link'
import { CotizacionForm } from '@/components/CotizacionForm'
import { Ranura } from '@/components/Ranura'
import { PAGO } from '@/data/pago'
import { CONFIG_COTIZACION, asistentesEnRango, type CartaCotizacionId, type DuracionCotizacion } from '@/data/precios-cotizacion'
import { metadataPagina } from '@/lib/seo'

export const metadata = metadataPagina(
  'Cotiza tu evento',
  'Elige un pack o arma una ruta de barra libre para tu evento en Santiago. Recibe la cotización con el detalle por correo.',
  '/cotizar',
)

type Parametros = {
  carta?: string
  invitados?: string
  horas?: string
  personalizada?: string
  pack?: string
  modo?: string
}

function esCartaValida(valor: string | undefined): valor is CartaCotizacionId {
  return CONFIG_COTIZACION.cartas.some((carta) => carta.id === valor)
}

function esDuracionValida(valor: number): valor is DuracionCotizacion {
  return CONFIG_COTIZACION.duraciones.includes(valor as DuracionCotizacion)
}

function asistentesValidos(valor: string | undefined): number | undefined {
  if (!valor) return undefined
  const cantidad = Number(valor)
  return asistentesEnRango(cantidad) ? cantidad : undefined
}

/** Cotizador público con tarifas de venta editables, separado del modelo interno de costos. */
export default async function PaginaCotizar({
  searchParams,
}: {
  searchParams: Promise<Parametros>
}) {
  const parametros = await searchParams
  const asistentesIniciales = asistentesValidos(parametros.invitados)
  const horasSolicitadas = Number(parametros.horas)
  const duracionInicial = esDuracionValida(horasSolicitadas) ? horasSolicitadas : undefined
  const cartaInicial = esCartaValida(parametros.carta) ? parametros.carta : undefined
  const packInicial = esCartaValida(parametros.pack) ? parametros.pack : undefined

  return (
    <>
      <header className="pagina-cabecera">
        <div className="lienzo pagina-cabecera__interior">
          <p className="micro">Cotizar</p>
          <h1>Cotiza tu barra libre.</h1>
          <p className="lead">Elige una ruta, cuéntanos sobre tu evento y recibe el precio final, el detalle y la carta por correo.</p>
        </div>
      </header>

      <section className="seccion" aria-label="Cotizador en tres pasos">
        <div className="lienzo">
          <CotizacionForm
            cartaInicial={cartaInicial}
            asistentesIniciales={asistentesIniciales}
            duracionInicial={duracionInicial}
            packInicial={packInicial}
            modoInicial={parametros.modo === 'flexible' || parametros.personalizada === '1' ? 'flexible' : undefined}
          />
        </div>
      </section>

      <Ranura
        id="titulo-que-incluye"
        micro="Incluido en el servicio"
        titulo="Una barra libre, atendida por nuestro equipo."
        imagen="/fotos/bartender-cotizando.jpg"
        imagenAlt="Bartender entrega un cóctel frente a una barra al aire libre"
        medida="retrato"
        invertida
        enfoque="center 45%"
      >
        <ul className="lista-marcada">
          <li>Barra montada y operativa en el lugar del evento.</li>
          <li>Cristalería, hielo, mixers, insumos y guarniciones frescas.</li>
          <li>Servicio de barra libre durante las horas contratadas.</li>
          <li>Montaje antes del evento y desmontaje al terminar.</li>
          <li>La comuna y el traslado se confirman en la cotización.</li>
        </ul>
      </Ranura>

      <section className="seccion seccion--tinta" aria-labelledby="titulo-condiciones-cotizacion">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Reserva y beneficios</p>
            <h2 className="h2" id="titulo-condiciones-cotizacion">{PAGO.resumen}</h2>
            <p className="lead">{PAGO.detalle}</p>
          </div>
          <div className="rejilla rejilla--2">
            <article className="condicion">
              <h3 className="condicion__titulo">Servicio de barra libre</h3>
              <p>Tu cotización considera servicio libre de las bebidas de la carta elegida durante todas las horas contratadas.</p>
            </article>
            <article className="condicion">
              <h3 className="condicion__titulo">Carta digital con branding</h3>
              <p>Si la quieres, puedes solicitarla sin costo y con al menos 5 días de anticipación.</p>
            </article>
          </div>
          <p className="nota-pie">
            ¿Quieres ver qué incluye cada carta?{' '}
            <Link className="enlace" href="/carta">Revisa la carta</Link> antes de enviar tu solicitud.
          </p>
        </div>
      </section>
    </>
  )
}
