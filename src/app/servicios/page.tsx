import type { Metadata } from 'next'
import Link from 'next/link'
import { RutasServicio } from '@/components/RutasServicio'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Elige Ruta Esencial, Ruta Full, Ruta Zero o solicita una carta personalizada. Barra libre atendida para tu evento.',
  alternates: { canonical: '/servicios' },
}

export default function PaginaServicios() {
  return (
    <>
      <header className="pagina-cabecera">
        <div className="lienzo pagina-cabecera__interior">
          <p className="micro">Servicios</p>
          <h1>Una ruta de tragos para cada evento.</h1>
          <p className="lead">Elige entre tres rutas o pide una carta personalizada. Siempre con barra libre durante las horas contratadas.</p>
        </div>
      </header>

      <RutasServicio />

      <section className="seccion seccion--papel-hondo" aria-labelledby="titulo-barra-libre">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Cómo funciona</p>
            <h2 className="h2" id="titulo-barra-libre">Barra libre, sin cobro por vaso.</h2>
            <p className="lead">Las rutas parten con cinco horas, pero eliges la duración al cotizar. El total depende de la carta, los invitados y el lugar del evento.</p>
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
