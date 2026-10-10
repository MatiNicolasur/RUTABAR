import type { Metadata } from 'next'
import Link from 'next/link'
import { Icono } from '@/components/Icono'
import { Ranura } from '@/components/Ranura'
import { ServiciosInteractivos } from '@/components/ServiciosInteractivos'
import { ALTERNATIVAS_CARTA } from '@/data/carta-web'
import { SEGMENTOS } from '@/data/servicios'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Elige la carta de RUTABAR según tus invitados y presupuesto. Barra libre atendida durante las horas contratadas para eventos privados y de empresa.',
  alternates: { canonical: '/servicios' },
}

const ICONO_SEGMENTO: Record<string, string> = {
  privados: '3',
  celebraciones: '15',
  empresas: '26',
}

export default function PaginaServicios() {
  const iconos = Object.fromEntries(
    SEGMENTOS.map((segmento) => [
      segmento.id,
      <Icono key={segmento.id} nombre={ICONO_SEGMENTO[segmento.id] ?? '3'} tamano={34} />,
    ]),
  )

  return (
    <>
      <header className="pagina-cabecera">
        <div className="lienzo pagina-cabecera__interior">
          <p className="micro">Servicios</p>
          <h1>La ruta de tragos para tu evento.</h1>
          <p className="lead">
            Tres cartas para distintos gustos y presupuestos. Siempre con barra libre durante las horas contratadas.
          </p>
        </div>
      </header>

      <section className="seccion" aria-label="Tipos de servicio">
        <div className="lienzo">
          <ServiciosInteractivos segmentos={SEGMENTOS} iconos={iconos} />
        </div>
      </section>

      <Ranura
        id="titulo-servicios-equipo"
        micro="Quién atiende"
        titulo="Cada trago tiene a alguien detrás."
        imagen="/fotos/bartender-sirviendo.jpg"
        imagenAlt="Bartender de RUTABAR sirviendo un cóctel con guarnición de fruta a un invitado durante un evento"
        medida="cuadrado"
        invertida
        enfoque="center 38%"
      >
        <p className="lead">
          Nuestro equipo monta la barra y atiende a tus invitados de principio a fin.
        </p>
      </Ranura>

      <section className="seccion" aria-labelledby="titulo-rutas-servicio">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Elige tu ruta</p>
            <h2 className="h2" id="titulo-rutas-servicio">La carta se adapta a tu presupuesto.</h2>
            <p className="lead">Cada opción define qué pueden pedir tus invitados; el servicio de barra libre es el mismo.</p>
          </div>
          <div className="servicios-rutas">
            {ALTERNATIVAS_CARTA.map((opcion) => (
              <article className="servicios-ruta" key={opcion.nombre}>
                <p className="micro">{opcion.cantidad}</p>
                <h3>{opcion.nombre}</h3>
                <p>{opcion.detalle}</p>
              </article>
            ))}
          </div>
          <Link className="enlace" href="/carta">Ver la carta completa</Link>
        </div>
      </section>

      <section className="seccion seccion--papel-hondo" aria-labelledby="titulo-barra-libre">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Cómo funciona</p>
            <h2 className="h2" id="titulo-barra-libre">Barra libre, sin cobro por cada vaso.</h2>
            <p className="lead">
              El total se cotiza por asistentes, alternativa de carta y cantidad de horas. Durante ese
              período, el equipo prepara las bebidas incluidas sin cobrar cada preparación por separado.
            </p>
          </div>
          <div className="fila" style={{ marginBlockStart: '2rem' }}>
            <Link className="boton" href="/cotizar">Cotizar mi evento</Link>
          </div>
        </div>
      </section>
    </>
  )
}
