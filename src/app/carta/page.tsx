import { CartaInteractiva } from '@/components/CartaInteractiva'
import { metadataPagina } from '@/lib/seo'

export const metadata = metadataPagina(
  'Carta de cócteles y mocktails',
  'Explora la carta de cócteles y mocktails de RUTABAR y filtra las opciones con y sin alcohol.',
  '/carta',
)

export default function PaginaCarta() {
  return (
    <>
      <section className="seccion carta-evento" aria-label="Carta de cócteles y mocktails">
        <div className="lienzo">
          <h1 className="solo-lectores">Carta de cócteles y mocktails</h1>
          <CartaInteractiva />
        </div>
      </section>
    </>
  )
}
