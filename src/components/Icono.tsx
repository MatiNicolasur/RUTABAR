import { ICONOS } from '@/data/iconos'

type Props = {
  /** Número del icono en `branding/iconos/`. */
  nombre: string
  /** Ancho en píxeles; el alto sale de la proporción del propio icono. */
  tamano?: number
  className?: string
  /**
   * Si se pasa, el icono deja de ser decorativo y anuncia este texto.
   * Por defecto son decorativos: casi siempre acompañan a un título que ya
   * dice lo mismo, y repetirlo en el lector de pantalla solo agrega ruido.
   */
  titulo?: string
}

/**
 * Icono de marca.
 *
 * Se inlinea el SVG en vez de servirlo como archivo por tres razones: hereda el
 * color con `currentColor`, no suma una petición de red y no parpadea al cargar
 * junto al texto. Los trazos vienen normalizados desde `src/data/iconos.ts`.
 */
export function Icono({ nombre, tamano = 32, className, titulo }: Props) {
  const icono = ICONOS[nombre]
  if (!icono) return null

  const [, , ancho, alto] = icono.viewBox.split(' ').map(Number)
  const proporcion = alto && ancho ? alto / ancho : 1

  return (
    <svg
      className={className ? `icono ${className}` : 'icono'}
      width={tamano}
      height={Math.round(tamano * proporcion)}
      viewBox={icono.viewBox}
      fill="currentColor"
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      {titulo ? <title>{titulo}</title> : null}
      {icono.paths.map((d, indice) => (
        <path key={indice} d={d} />
      ))}
    </svg>
  )
}
