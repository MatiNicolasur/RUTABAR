import type { Metadata } from 'next'
import Link from 'next/link'
import { Icono } from '@/components/Icono'
import { Ranura } from '@/components/Ranura'
import { RutasServicio } from '@/components/RutasServicio'
import { ServiciosInteractivos } from '@/components/ServiciosInteractivos'
import { SEGMENTOS } from '@/data/servicios'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Elige Ruta Esencial, Ruta Full, Ruta Zero o arma una ruta flexible. Barra libre atendida para eventos privados y de empresa.',
  alternates: { canonical: '/servicios' },
}

export default function PaginaServicios() {
  const nombresIcono: Record<string, string> = { privados: '3', celebraciones: '15', empresas: '26' }
  const iconos = Object.fromEntries(SEGMENTOS.map((segmento) => [segmento.id, <Icono key={segmento.id} nombre={nombresIcono[segmento.id] ?? '3'} tamano={34} />]))
  return (
    <>
      <header className="pagina-cabecera">
        <div className="lienzo pagina-cabecera__interior">
          <p className="micro">Servicios</p>
          <h1>Una ruta de tragos para cada evento.</h1>
          <p className="lead">Tres packs de cinco horas o una ruta flexible. Siempre con barra libre durante las horas contratadas.</p>
        </div>
      </header>

      <section className="seccion" aria-label="Tipos de evento que atendemos">
        <div className="lienzo"><ServiciosInteractivos segmentos={SEGMENTOS} iconos={iconos} /></div>
      </section>

      <Ranura id="titulo-servicios-equipo" micro="Quién atiende" titulo="Cada trago tiene a alguien detrás." imagen="/fotos/bartender-sirviendo.jpg" imagenAlt="Bartender de RUTABAR sirviendo un cóctel a un invitado" medida="cuadrado" invertida enfoque="center 38%">
        <p className="lead">Nuestro equipo monta la barra y atiende a tus invitados de principio a fin.</p>
      </Ranura>

      <RutasServicio />

      <section className="seccion seccion--papel-hondo" aria-labelledby="titulo-barra-libre">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Cómo funciona</p>
            <h2 className="h2" id="titulo-barra-libre">Barra libre, sin cobro por vaso.</h2>
            <p className="lead">Los packs incluyen cinco horas. Si prefieres otra duración, arma tu ruta entre 3 y 12 horas. El total depende de la carta y los invitados.</p>
          </div>
          <div className="fila" style={{ marginBlockStart: '2rem' }}>
            <Link className="boton" href="/cotizar">Cotizar mi evento</Link>
            <Link className="enlace" href="/carta">Explorar la carta</Link>
          </div>
        </div>
      </section>
    </>
  )
}
