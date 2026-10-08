'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

/** A subtle scroll-linked image track; static when motion is reduced. */
export function ParallaxScroll({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = ref.current
    const frame = track?.parentElement
    if (!track || !frame || typeof IntersectionObserver === 'undefined') return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    let visible = false
    let animationFrame = 0

    const update = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0
        const rect = frame.getBoundingClientRect()
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)))
        // As the page scrolls down, the photo follows upward by at most 10 px.
        track.style.setProperty('--scroll-shift', `${((0.5 - progress) * 20).toFixed(2)}px`)
      })
    }

    const enter = () => {
      if (visible) return
      visible = true
      track.dataset.scrollVisible = 'true'
      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)
      update()
    }

    const leave = () => {
      if (!visible) return
      visible = false
      track.dataset.scrollVisible = 'false'
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
      track.style.setProperty('--scroll-shift', '0px')
    }

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? enter() : leave(),
      { rootMargin: '100px 0px' },
    )
    observer.observe(frame)

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) leave()
      else observer.observe(frame)
    }
    reduceMotion.addEventListener('change', onMotionChange)

    return () => {
      leave()
      observer.disconnect()
      reduceMotion.removeEventListener('change', onMotionChange)
    }
  }, [])

  return <div className={`imagen-parallax ${className}`.trim()} ref={ref}>{children}</div>
}
