import Image from 'next/image'
import Link from 'next/link'
import { Icono } from '@/components/Icono'
import { Ranura } from '@/components/Ranura'
import { RutasServicio } from '@/components/RutasServicio'
import { ServiciosInteractivos } from '@/components/ServiciosInteractivos'
import { SistemaServicio } from '@/components/SistemaServicio'
import { SEGMENTOS } from '@/data/servicios'
import { metadataPagina } from '@/lib/seo'

export const metadata = metadataPagina(
  'Servicios de barra móvil',
  'Barra móvil atendida para eventos en Santiago: bartenders, cristalería, insumos y montaje. Packs de cinco horas o servicio flexible de 3 a 12 horas.',
  '/servicios',
)

export default function PaginaServicios() {
  const nombresIcono: Record<string, string> = { privados: '3', celebraciones: '15', empresas: '26' }
  const iconos = Object.fromEntries(SEGMENTOS.map((segmento) => [segmento.id, <Icono key={segmento.id} nombre={nombresIcono[segmento.id] ?? '3'} tamano={34} />]))

  return (
    <>
      <header className="pagina-cabecera servicios-hero">
        <div className="lienzo servicios-hero__interior">
          <div className="servicios-hero__texto">
            <p className="micro">Servicios · Santiago de Chile</p>
            <h1>La barra va a tu evento.</h1>
            <p className="lead">Llevamos una barra móvil, preparamos los tragos y atendemos a tus invitados. Durante las horas contratadas, la carta que elijas es barra libre.</p>
            <div className="servicios-hero__acciones">
              <Link className="boton boton--claro" href="#modalidades">Ver modalidades</Link>
              <Link className="servicios-hero__enlace" href="/cotizar">Cotizar mi evento <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <figure className="servicios-hero__foto">
            <Image
              src="/fotos/bartender-sirviendo.jpg"
              alt="Bartender sirviendo un cóctel en una barra de evento"
              fill
              priority
              sizes="(min-width: 62rem) 38vw, (min-width: 48rem) 43vw, 100vw"
            />
            <figcaption>Barra móvil · Servicio atendido</figcaption>
          </figure>
        </div>
      </header>

      <section className="seccion seccion--sistema servicios-incluye" aria-labelledby="titulo-incluye-servicios">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Qué hacemos</p>
            <h2 className="h2" id="titulo-incluye-servicios">Llegamos con todo para servir.</h2>
            <p className="lead">Montamos la barra, atendemos durante el evento y retiramos al terminar. El servicio incluye:</p>
          </div>
          <SistemaServicio />
        </div>
      </section>

      <RutasServicio vista="servicios" />

      <section className="seccion seccion--papel-hondo servicios-eventos" aria-labelledby="titulo-eventos-servicios">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Para qué eventos</p>
            <h2 className="h2" id="titulo-eventos-servicios">De cumpleaños a lanzamientos.</h2>
            <p className="lead">Nos adaptamos al espacio y al ritmo de tu evento.</p>
          </div>
          <ServiciosInteractivos segmentos={SEGMENTOS} iconos={iconos} />
        </div>
      </section>

      <Ranura
        id="titulo-servicios-equipo"
        micro="Hagamos tu ruta"
        titulo="Tú celebras. Nosotros servimos."
        imagen="/fotos/equipo-barra.jpg"
        imagenAlt="Integrante del equipo de RUTABAR detrás de una barra montada para un evento"
        medida="cuadrado"
        invertida
        enfoque="center 38%"
        accion={{ label: 'Cotizar mi evento', href: '/cotizar' }}
      >
        <p className="lead">Cuéntanos la fecha, la comuna y cuántas personas vienen. Te ayudamos a elegir carta y duración.</p>
      </Ranura>
    </>
  )
}
