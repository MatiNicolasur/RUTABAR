import type { Metadata } from 'next'
import Link from 'next/link'
import { CartaInteractiva } from '@/components/CartaInteractiva'
import { Reveal } from '@/components/Reveal'
import { MOCKTAILS_WEB, TRAGOS_WEB_CON_ALCOHOL } from '@/data/carta-web'

export const metadata: Metadata = {
  title: 'Carta',
  description:
    'Carta de RUTABAR: 13 cócteles y 4 mocktails para eventos en Santiago, además de bebidas y agua. Revisa vaso, base y guarnición de cada preparación.',
  alternates: { canonical: '/carta' },
}

export default function PaginaCarta() {
  return (
    <>
      <header className="pagina-cabecera">
        <div className="lienzo pagina-cabecera__interior">
          <p className="micro">Carta</p>
          <h1>
            {TRAGOS_WEB_CON_ALCOHOL.length} cócteles y {MOCKTAILS_WEB.length} mocktails.
          </h1>
          <p className="lead">
            Filtra por tipo y perfil. Revisa la base, el vaso y la guarnición de cada preparación.
          </p>
        </div>
      </header>

      <section className="seccion" aria-label="Carta completa">
        <div className="lienzo">
          <CartaInteractiva />
        </div>
      </section>

      <section className="seccion" aria-labelledby="titulo-reglas-carta">
        <div className="lienzo">
          <div className="seccion__encabezado">
            <p className="micro">Reglas de la carta</p>
            <h2 className="h2" id="titulo-reglas-carta">Barra libre.</h2>
          </div>

          <div className="rejilla rejilla--2">
            <Reveal className="condicion">
              <h3 className="condicion__titulo">Cómo funciona</h3>
              <ul className="lista-marcada">
                <li>Barra libre durante las horas contratadas: se pueden pedir las preparaciones incluidas en la carta elegida.</li>
                <li>La alternativa de carta se acuerda y se cierra al reservar.</li>
                <li>La opción Solo sin alcohol incluye 4 mocktails y bebidas sin alcohol.</li>
                <li>Podemos revisar alergias o restricciones si nos avisas con anticipación.</li>
              </ul>
            </Reveal>

            <Reveal className="condicion" retraso={60}>
              <h3 className="condicion__titulo">Servicio responsable</h3>
              <ul className="lista-marcada lista-marcada--no">
                <li>Las preparaciones y bebidas fuera de la alternativa acordada no están incluidas.</li>
                <li>La carta no se modifica el mismo día del evento.</li>
                <li>El servicio con alcohol es exclusivo para mayores de 18 años.</li>
                <li>Prohibida la venta de alcohol a menores. Consumir alcohol en exceso es dañino para la salud.</li>
              </ul>
            </Reveal>
          </div>

          <div className="fila" style={{ marginBlockStart: '2.5rem' }}>
            <Link className="boton" href="/cotizar">
              Cotizar mi evento
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
