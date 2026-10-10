import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Icono } from '@/components/Icono'
import { Preguntas } from '@/components/Preguntas'
import { Ranura } from '@/components/Ranura'
import { Reveal } from '@/components/Reveal'
import { SistemaServicio } from '@/components/SistemaServicio'
import { ICONOS } from '@/data/iconos'

const DATOS_RUTA = [
  { numero: '01', valor: '25', etiqueta: 'opciones en la carta completa', pilar: 'Sabor', destino: '#ruta-sabor' },
  { numero: '02', valor: '3', etiqueta: 'cartas para elegir tu experiencia', pilar: 'Barra', destino: '#ruta-barra' },
  { numero: '03', valor: '3–12', etiqueta: 'horas de barra libre a elección', pilar: 'Ritmo', destino: '#ruta-ritmo' },
] as const

const ESTANDAR = [
  {
    palabra: 'Sabor',
    texto: 'Cócteles, mocktails y favoritos de la ruta chilena.',
  },
  {
    palabra: 'Barra',
    texto: 'Una carta elegida para tu gente y tu presupuesto.',
  },
  {
    palabra: 'Ritmo',
    texto: 'Barra libre durante las horas que elijas.',
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
        lineas={['Tu ruta favorita de tragos.']}
        acento="ruta"
        accion={{ label: 'Cotizar mi evento', href: '/cotizar' }}
        accionSecundaria={{ label: 'Ver la carta', href: '/carta' }}
        marca="ruta bar"
      />

      <section className="datos-ruta" aria-label="La ruta en tres datos">
        <div className="lienzo datos-ruta__interior">
          {DATOS_RUTA.map((dato) => (
            <Link className="datos-ruta__item" href={dato.destino} key={dato.numero}>
              <span className="datos-ruta__numero">{dato.numero} / {dato.pilar}</span>
              <strong className="datos-ruta__valor">{dato.valor}</strong>
              <span className="datos-ruta__etiqueta">{dato.etiqueta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="seccion" aria-labelledby="titulo-estandar">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Nuestro estándar</p>
            <h2 className="h2" id="titulo-estandar">
              <span className="punto">Sabor</span>{' '}
              <span className="punto">Barra</span>{' '}
              <span className="punto">Ritmo</span>
            </h2>
          </div>

          <div className="estandar">
            <div className="estandar__lista">
              {ESTANDAR.map((item, indice) => (
                <Reveal className="estandar__bloque" key={item.palabra} retraso={indice * 60}>
                  <span className="estandar__numero">{String(indice + 1).padStart(2, '0')}</span>
                  <h3 className="estandar__palabra" id={`ruta-${item.palabra.toLowerCase()}`}>{item.palabra}</h3>
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
        titulo="La ruta de tragos llega a tu evento."
        mano="tragos de la ruta chilena"
        imagen="/fotos/bartender-patio-editorial.webp"
        imagenAlt="Imagen ilustrativa de un bartender sirviendo un cóctel a invitados en una barra móvil negra con base de madera, en un patio al atardecer"
        medida="retrato"
        enfoque="center 44%"
        sinOptimizacion
        invertida
      >
        <p className="lead">
          Elige tu carta. Nosotros nos encargamos de servirla.
        </p>
      </Ranura>

      <section className="seccion seccion--sistema" aria-labelledby="titulo-sistema">
        <div className="sistema__barra-fondo" aria-hidden="true">
          <Icono nombre="33" tamano={160} />
        </div>
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Todo lo necesario</p>
            <h2 className="h2" id="titulo-sistema">Todo lo necesario para servir.</h2>
          </div>
          <SistemaServicio />
        </div>
      </section>

      <Ranura
        id="titulo-carta"
        micro="La carta"
        accion={{ label: 'Explorar la carta', href: '/carta' }}
        titulo="Tu ruta favorita, vaso a vaso."
        imagen="/fotos/garnituras.jpg"
        imagenAlt="Estación de guarniciones: cítricos, flores comestibles, limones y sales preparados antes del servicio"
        medida="retrato"
        enfoque="center 45%"
        mano="la guarnición se corta el mismo día"
        confeti
      >
        <p className="lead">
          Explora la carta completa y elige una selección a tu medida.
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
          <p className="lead">Fecha, comuna e invitados: con eso empieza tu ruta.</p>
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
