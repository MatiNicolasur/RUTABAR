'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Retraso del escalonado, en milisegundos. */
  retraso?: number
  as?: ElementType
  className?: string
}

/**
 * Revelado al hacer scroll.
 *
 * Arranca VISIBLE y solo se oculta cuando ya sabemos que hay JavaScript, que
 * el navegador soporta IntersectionObserver y que el elemento está fuera de
 * pantalla. Así, si el JS falla o no carga, el contenido nunca queda invisible.
 *
 * La animación es de `transform` y `opacity` únicamente: no hay propiedades de
 * layout en la transición y por lo tanto no hay reflujo ni CLS.
 */
export function Reveal({ children, retraso = 0, as: Tag = 'div', className = '' }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Si ya está a la vista al hidratar, no hay nada que revelar.
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92) return

    setVisible(false)

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            setVisible(true)
            observer.unobserve(entrada.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`revelar ${className}`.trim()}
      data-visible={visible ? 'true' : 'false'}
      style={{ '--retraso': `${retraso}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
