import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { Icono } from '@/components/Icono'
import { Preguntas } from '@/components/Preguntas'
import { Ranura } from '@/components/Ranura'
import { Reveal } from '@/components/Reveal'
import { SistemaServicio } from '@/components/SistemaServicio'
import { ICONOS } from '@/data/iconos'

const ESTANDAR = [
  {
    palabra: 'Sabor',
    porcentaje: '71%',
    dato: 'de quienes consumen cócteles dice que el sabor es el principal factor al momento de elegir qué tomar.',
    texto: 'Por eso partimos por lo esencial: buenas recetas, ingredientes seleccionados y tragos preparados para disfrutarlos de verdad.',
  },
  {
    palabra: 'Barra',
    porcentaje: '72%',
    dato: 'de los consumidores recurre al bartender cuando necesita ayuda para decidir qué pedir.',
    texto: 'Nuestra barra no solo sirve tragos. Recomienda, prepara y mantiene la experiencia fluyendo durante todo el evento.',
  },
  {
    palabra: 'Ritmo',
    porcentaje: '79%',
    dato: 'de las personas se siente atraída por eventos que combinan distintos intereses y experiencias.',
    texto: 'Porque una buena celebración no ocurre alrededor de una copa: ocurre alrededor de las personas, la música, las conversaciones y esos momentos que nadie planificó.',
  },
]

const ICONOS_MARCA = Object.keys(ICONOS)

export default function Home() {
  return (
    <>
      <Hero
        diseno="retrato"
        imagen="/fotos/cocteles-speakeasy-grano.jpg"
        imagenRespaldo="/fotos/cocteles-speakeasy.jpg"
        imagenAlt="Cócteles en primer plano en una barra speakeasy iluminada en rojo, con personas conversando al fondo"
        lineas={['Servicio de barra móvil', 'a la puerta de tu evento']}
        accion={{ label: 'Cotizar mi evento', href: '/cotizar' }}
        accionSecundaria={{ label: 'Ver la carta', href: '/carta' }}
        marca="rutabar"
        ubicacion={'bar móvil en\nsantiago de chile'}
      />

      <section className="seccion" aria-labelledby="titulo-estandar">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Nuestro estándar</p>
            <h2 className="h2 estandar__titulo" id="titulo-estandar" aria-label="Sabor. Barra. Ritmo.">
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
                  <h3 className="estandar__palabra" id={`ruta-${item.palabra.toLowerCase()}`}>{item.palabra}.</h3>
                  <p className="estandar__dato"><strong>{item.porcentaje}</strong> {item.dato}</p>
                  <p className="estandar__texto">{item.texto}</p>
                </Reveal>
              ))}
            </div>
            <div className="estandar__figura" aria-hidden="true">
              <Icono nombre="35" tamano={240} />
            </div>
          </div>
          <div className="estandar__cierre">
            <p className="estandar__declaracion">Ruta Bar transforma tu evento en un punto de encuentro.</p>
            <p className="estandar__remate">Coctelería de ruta a tu evento.</p>
          </div>
        </div>
      </section>

      <Ranura
        id="titulo-barra"
        micro="El servicio"
        titulo="La ruta de tragos llega a tu evento."
        imagen="/fotos/bartender-patio-editorial.webp"
        imagenAlt="Imagen ilustrativa de un bartender sirviendo un cóctel a invitados en una barra móvil negra con base de madera, en un patio al atardecer"
        medida="retrato"
        enfoque="center 44%"
        sinOptimizacion
        invertida
      >
        <p className="lead">
          Vamos cambiando la carta por época del año. Estamos en primavera y por eso nuestros tragos son más cítricos y dulces.
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
          <h2 className="h2" id="titulo-cierre">Llena el formulario y recibe una cotización en menos de 5 min</h2>
          <div className="cierre__acciones">
            <Link className="boton boton--claro" href="/cotizar">Cotizar mi evento</Link>
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
