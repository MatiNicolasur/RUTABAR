import { CARTA_WEB } from '@/data/carta-web'
import { CartaFiltro } from './CartaFiltro'
import { TarjetaTrago } from './TarjetaTrago'

/** La carta se compone en el servidor; cada tarjeta maneja su apertura en el cliente. */
export function CartaInteractiva() {
  const resumen = CARTA_WEB.map((trago) => ({ id: trago.id, familia: trago.familia }))

  return (
    <div className="carta-publica">
      <CartaFiltro tragos={resumen}>
        <ul className="carta-lista">
          {CARTA_WEB.map((trago) => (
            <TarjetaTrago key={trago.id} trago={trago} />
          ))}
        </ul>
      </CartaFiltro>

    </div>
  )
}
