'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Sello } from './Sello'
import { SITIO } from '@/lib/seo'

/**
 * Cabecera.
 *
 * Cuatro decisiones:
 *
 * 1. **El sello va a la izquierda, sin el nombre al lado.** El propio sello dice
 *    "ruta bar": repetirlo era decir dos veces lo mismo. A la izquierda es donde
 *    se busca la marca, y deja libre el centro para la navegación.
 * 2. **El centro es de la navegación.** Los enlaces van juntos y
 *    centrados, no repartidos a los costados: agrupados se leen como un menú,
 *    repartidos se leen como dos grupos sin relación.
 * 3. **Arranca transparente sobre el hero y recién después se asienta.** Cuando
 *    el hero todavía está en pantalla, la cabecera no tiene fondo ni borde: se
 *    mezcla con la pieza de marca y el sello va en blanco. Al salir el hero
 *    aparece el fondo translúcido y el sello vuelve al rojo.
 * 4. **La cabecera no lleva adornos.** Los dibujos de la marca viven en el
 *    hero, donde tienen espacio para leerse enteros.
 *
 * El cambio de estado lo dispara un `IntersectionObserver` sobre el hero, no un
 * listener de scroll: el observer avisa una vez por cruce y no cuesta nada por
 * frame. En las páginas sin hero la cabecera queda asentada desde el arranque.
 */

const ENLACES = [
  { href: '/', etiqueta: 'Inicio' },
  { href: '/servicios', etiqueta: 'Servicios' },
  { href: '/carta', etiqueta: 'Carta' },
  { href: '/condiciones', etiqueta: 'Condiciones' },
]

export function SiteHeader() {
  const ruta = usePathname()
  const menuRef = useRef<HTMLDetailsElement>(null)
  const [faseMenu, setFaseMenu] = useState<'cerrado' | 'entrando' | 'abierto' | 'saliendo'>('cerrado')

  useEffect(() => {
    setFaseMenu((fase) => fase === 'cerrado' ? fase : 'saliendo')
  }, [ruta])

  useEffect(() => {
    if (faseMenu === 'entrando') {
      const frame = requestAnimationFrame(() => setFaseMenu((fase) => fase === 'entrando' ? 'abierto' : fase))
      return () => cancelAnimationFrame(frame)
    }

    if (faseMenu === 'saliendo') {
      const cierre = window.setTimeout(() => setFaseMenu((fase) => fase === 'saliendo' ? 'cerrado' : fase), 340)
      return () => window.clearTimeout(cierre)
    }
  }, [faseMenu])

  useEffect(() => {
    const cerrarFuera = (evento: PointerEvent) => {
      if (menuRef.current?.open && !menuRef.current.contains(evento.target as Node)) {
        setFaseMenu((fase) => fase === 'abierto' || fase === 'entrando' ? 'saliendo' : fase)
      }
    }

    document.addEventListener('pointerdown', cerrarFuera)
    return () => document.removeEventListener('pointerdown', cerrarFuera)
  }, [])

  useEffect(() => {
    if (faseMenu === 'cerrado') return
    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key !== 'Escape') return
      setFaseMenu('saliendo')
      menuRef.current?.querySelector('summary')?.focus()
    }
    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [faseMenu])

  /**
   * El estado "sobre el hero" tiene que estar bien desde el primer frame.
   *
   * Si se resuelve en un `useEffect`, entre el HTML y la hidratación la
   * cabecera se muestra con su fondo claro —el valor que trae el HTML— y
   * después salta al transparente. Ese salto se ve como un parpadeo, y en una
   * captura temprana se ve directamente como el estado equivocado.
   *
   * `useLayoutEffect` corre antes de que el navegador pinte, así que el atributo
   * ya está resuelto en el primer frame: no hay parpadeo y la captura no puede
   * fotografiar el estado intermedio.
   */
  useLayoutEffect(() => {
    const cabecera = document.querySelector('.cabecera')
    const hero = document.querySelector('.hero')
    if (!cabecera) return

    const decidir = () => {
      if (!hero) return 'false'
      // Con el hero ya pasado —recarga a media página— la cabecera nace
      // asentada, que es lo que corresponde.
      return hero.getBoundingClientRect().bottom > 0 ? 'true' : 'false'
    }

    cabecera.setAttribute('data-sobre-hero', decidir())
    if (!hero) return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        cabecera.setAttribute('data-sobre-hero', entrada.isIntersecting ? 'true' : 'false')
      },
      // El hero tiene que estar prácticamente fuera para que la cabecera se
      // asiente: si no, el fondo aparece cuando todavía se ve la pieza.
      { rootMargin: '-72px 0px 0px 0px', threshold: 0 },
    )

    observador.observe(hero)
    return () => observador.disconnect()
  }, [ruta])

  const enlace = (item: { href: string; etiqueta: string }) => (
    <Link
      key={item.href}
      className="enlace cabecera__enlace"
      href={item.href}
      aria-current={ruta === item.href ? 'page' : undefined}
    >
      {item.etiqueta}
    </Link>
  )

  return (
    // El estado inicial es `true` a propósito: así el HTML servido ya trae la
    // cabecera transparente y el primer frame sobre el hero es el correcto. El
    // efecto lo corrige antes de pintar en las páginas sin hero.
    <header className="cabecera" data-sobre-hero="true" data-entrada={ruta === '/' ? 'hero' : 'pagina'}>
      <div className="lienzo cabecera__interior">
        <Link className="cabecera__marca" href="/" aria-label={`${SITIO.nombre}, ir al inicio`}>
          <Sello tamano={72} className="cabecera__sello" />
        </Link>

        <nav className="cabecera__nav" aria-label="Navegación principal">
          {ENLACES.map(enlace)}
        </nav>

        <div className="cabecera__acciones">
          <Link className="boton cabecera__cta" href="/cotizar">
            Cotizar
          </Link>

          <details
            className="cabecera__menu"
            ref={menuRef}
            open={faseMenu !== 'cerrado'}
            data-fase={faseMenu}
          >
            <summary
              aria-expanded={faseMenu === 'entrando' || faseMenu === 'abierto'}
              onClick={(evento) => {
                evento.preventDefault()
                setFaseMenu((fase) => fase === 'abierto' || fase === 'entrando' ? 'saliendo' : 'entrando')
              }}
            >
              <span className="cabecera__hamburguesa" aria-hidden="true"><span /><span /><span /></span>
              <span className="solo-lectores">Menú</span>
            </summary>
            <div className="cabecera__menuScrim" aria-hidden="true" onClick={() => setFaseMenu('saliendo')} />
            <div className="cabecera__menuPanel" inert={faseMenu !== 'abierto'}>
              {ENLACES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={ruta === item.href ? 'page' : undefined}
                  onClick={() => setFaseMenu('saliendo')}
                >
                  {item.etiqueta}
                </Link>
              ))}
              <Link className="cabecera__menuCta" href="/cotizar" onClick={() => setFaseMenu('saliendo')}>
                Cotizar mi evento
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
