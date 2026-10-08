import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Icono } from '@/components/Icono'
import { Preguntas } from '@/components/Preguntas'
import { Ranura } from '@/components/Ranura'
import { Reveal } from '@/components/Reveal'
import { SistemaServicio } from '@/components/SistemaServicio'
import { ICONOS } from '@/data/iconos'
import { MOCKTAILS_WEB, TRAGOS_WEB_CON_ALCOHOL } from '@/data/carta-web'

const ESTANDAR = [
  {
    palabra: 'Sabor',
    texto: 'La misma receta y la misma medida en cada vaso, del primero al último.',
  },
  {
    palabra: 'Barra',
    texto: 'Cristalería, guarniciones frescas y una estación ordenada durante el servicio.',
  },
  {
    palabra: 'Ritmo',
    texto: 'Una carta bien elegida permite preparar cada pedido con agilidad.',
  },
]

const ICONOS_MARCA = Object.keys(ICONOS)

export default function Home() {
  return (
    <>
      <Hero
        diseno="retrato"
        imagen="/fotos/cocteles-editorial.webp"
        imagenAlt="Imagen ilustrativa de un pisco sour y un mocktail de pomelo y romero sobre una barra al atardecer"
        lineas={['Barra móvil para eventos en Santiago']}
        lead="Barra libre con cócteles y mocktails, cristalería y equipo. Elige la carta y las horas; recibe una cotización por escrito."
        accion={{ label: 'Cotizar mi evento', href: '/cotizar' }}
        accionSecundaria={{ label: 'Ver la carta', href: '/carta' }}
        marca="ruta bar"
      />

      <section className="seccion" aria-labelledby="titulo-estandar">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Nuestro estándar</p>
            <h2 className="h2" id="titulo-estandar">
              <span className="punto">Sabor</span>{' '}
              <span className="punto">Barra</span>{' '}
              <span className="punto">Ritmo</span>
            </h2>
            <p className="lead">Recetas medidas, presentación cuidada y un equipo listo a la hora acordada.</p>
          </div>

          <div className="estandar">
            <div className="estandar__lista">
              {ESTANDAR.map((item, indice) => (
                <Reveal className="estandar__bloque" key={item.palabra} retraso={indice * 60}>
                  <span className="estandar__numero">{String(indice + 1).padStart(2, '0')}</span>
                  <h3 className="estandar__palabra">{item.palabra}</h3>
                  <p className="estandar__texto">{item.texto}</p>
                </Reveal>
              ))}
            </div>
            <div className="estandar__figura" aria-hidden="true">
              <Icono nombre="35" tamano={240} />
            </div>
          </div>
        </div>
      </section>

      <Ranura
        id="titulo-barra"
        micro="El servicio"
        titulo="Una barra en movimiento, un servicio atento."
        imagen="/fotos/bartender-patio-editorial.webp"
        imagenAlt="Imagen ilustrativa de un bartender sirviendo un cóctel a invitados en una barra móvil negra con base de madera, en un patio al atardecer"
        medida="retrato"
        enfoque="center 44%"
        sinOptimizacion
        invertida
      >
        <p className="lead">
          Llegamos con la barra, preparamos cada pedido y atendemos a tus invitados durante todo el servicio.
        </p>
        <p className="prosa">
          La barra móvil negra y su base de madera se integran al patio; el equipo y los detalles de montaje se coordinan para el espacio.
        </p>
      </Ranura>

      <section className="seccion seccion--sistema" aria-labelledby="titulo-sistema">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Todo lo necesario</p>
            <h2 className="h2" id="titulo-sistema">Todo lo necesario para servir.</h2>
            <p className="lead">
              Cada parte de la barra queda descrita antes del evento, desde la cristalería hasta el montaje.
            </p>
          </div>
          <SistemaServicio />
        </div>
      </section>

      <Ranura
        id="titulo-carta"
        micro="La carta"
        accion={{ label: 'Explorar la carta', href: '/carta' }}
        titulo={`${TRAGOS_WEB_CON_ALCOHOL.length} cócteles, ${MOCKTAILS_WEB.length} mocktails.`}
        imagen="/fotos/garnituras.jpg"
        imagenAlt="Estación de guarniciones: cítricos, flores comestibles, limones y sales preparados antes del servicio"
        medida="retrato"
        enfoque="center 45%"
        mano="la guarnición se corta el mismo día"
        confeti
      >
        <p className="lead">
          Una selección pensada para servir con consistencia: cócteles clásicos, preparaciones de autor y opciones sin alcohol.
        </p>
        <p className="prosa">
            Los mocktails reciben la misma atención y presentación que el resto de la carta.
        </p>
      </Ranura>

      <section className="seccion seccion--rojo cierre-visual" aria-labelledby="titulo-cierre">
        <div className="cierre-visual__iconos" aria-hidden="true">
          {ICONOS_MARCA.map((nombre, indice) => (
            <span className="cierre-visual__icono" key={nombre}>
              <Icono nombre={nombre} tamano={52 + (indice % 3) * 16} />
            </span>
          ))}
        </div>
        <div className="lienzo cierre-visual__contenido">
          <p className="micro">Siguiente paso</p>
          <h2 className="h2" id="titulo-cierre">Cuéntanos de tu evento y te cotizamos.</h2>
          <p className="lead">
            Dinos la fecha, la comuna, cuántos invitados esperas y cuánto tiempo quieres la barra. Te enviamos una propuesta por escrito.
          </p>
          <div className="cierre__acciones">
            <Link className="boton boton--claro" href="/cotizar">Cotizar mi evento</Link>
            <Link className="boton boton--fantasma" href="/carta">Ver la carta</Link>
          </div>
        </div>
      </section>

      <section className="seccion" aria-labelledby="titulo-preguntas">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Preguntas frecuentes</p>
            <h2 className="h2" id="titulo-preguntas">Lo que se pregunta antes de reservar.</h2>
          </div>
          <Preguntas />
        </div>
      </section>
    </>
  )
}
