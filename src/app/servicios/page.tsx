import type { Metadata } from 'next'
import Link from 'next/link'
import { Icono } from '@/components/Icono'
import { Ranura } from '@/components/Ranura'
import { Reveal } from '@/components/Reveal'
import { ServiciosInteractivos } from '@/components/ServiciosInteractivos'
import { SEGMENTOS } from '@/data/servicios'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Barra móvil con servicio libre de cócteles y mocktails durante las horas contratadas. Atención para celebraciones privadas, matrimonios y eventos de empresa.',
  alternates: { canonical: '/servicios' },
}

const ICONO_SEGMENTO: Record<string, string> = {
  privados: '3',
  celebraciones: '15',
  empresas: '26',
}

const SIEMPRE_INCLUIDO = [
  'Barra montada y operativa en el lugar del evento.',
  'Cristalería de vidrio en cantidad suficiente para el número de invitados.',
  'Hielo, mixers, insumos y guarniciones frescas cortadas el mismo día.',
  'Personal: bartender y ayudante según la demanda declarada.',
  'Montaje antes del evento y desmontaje al terminar.',
  'Traslado dentro del sector definido en la cotización.',
]

const NUNCA_INCLUIDO = [
  'Bebidas, marcas o preparaciones fuera de la carta acordada.',
  'Horas adicionales sobre las contratadas.',
  'Traslado fuera del sector definido en la cotización.',
  'Cambios de carta el mismo día del evento.',
]

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
            <h1>Barra libre atendida para tu evento.</h1>
            <p className="lead">
              Elige la carta y la duración. Durante las horas contratadas, tus invitados pueden
              pedir libremente las bebidas incluidas en la cotización.
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
        titulo="Detrás de la barra hay una persona, no una máquina."
        imagen="/fotos/bartender-sirviendo.jpg"
        imagenAlt="Bartender de RUTABAR sirviendo un cóctel con guarnición de fruta a un invitado durante un evento"
        medida="cuadrado"
        invertida
        enfoque="center 38%"
      >
        <p className="lead">
          El servicio lo ejecuta nuestro propio equipo. Eso es lo que permite sostener el mismo
          estándar entre un evento de 30 personas y uno de 150, y lo que hace que un error se corrija
          en el momento.
        </p>
        <p className="prosa">
          Para eventos grandes sumamos dotación en vez de acelerar a quien ya está trabajando. Una
          barra con fila deja de ser un buen servicio, por más buena que sea la carta.
        </p>
      </Ranura>

      <section className="seccion" aria-labelledby="titulo-incluye">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Incluido en cada evento</p>
            <h2 className="h2" id="titulo-incluye">
              Lo que cambia y lo que no.
            </h2>
            <p className="lead">
              La carta y la duración quedan acordadas en la cotización. La barra funciona libremente
              durante todo ese horario.
            </p>
          </div>

          <div className="rejilla rejilla--2">
            <Reveal className="condicion">
              <h3 className="condicion__titulo">Siempre incluido</h3>
              <ul className="lista-marcada">
                {SIEMPRE_INCLUIDO.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="condicion" retraso={60}>
              <h3 className="condicion__titulo">Nunca incluido</h3>
              <ul className="lista-marcada lista-marcada--no">
                {NUNCA_INCLUIDO.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
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
          <div className="rejilla rejilla--2">
            <Reveal className="condicion">
              <h3 className="condicion__titulo">Durante el servicio</h3>
              <ul className="lista-marcada">
                <li>Barra móvil montada y atendida por nuestro equipo.</li>
                <li>Pedidos libres de las bebidas incluidas en la carta acordada.</li>
                <li>Cristalería, hielo, mixers, insumos y guarniciones.</li>
              </ul>
            </Reveal>
            <Reveal className="condicion" retraso={60}>
              <h3 className="condicion__titulo">Antes de reservar</h3>
              <ul className="lista-marcada">
                <li>Confirmamos carta, horas, asistentes y lugar.</li>
                <li>El traslado y las condiciones del recinto quedan por escrito.</li>
                <li>Las horas adicionales se cotizan aparte.</li>
              </ul>
            </Reveal>
          </div>

          <div className="fila" style={{ marginBlockStart: '2rem' }}>
            <Link className="boton" href="/cotizar">Cotizar mi evento</Link>
          </div>
        </div>
      </section>
    </>
  )
}
