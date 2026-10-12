'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { CONFIG_COTIZACION, asistentesEnRango, type CartaCotizacionId, type DuracionCotizacion } from '@/data/precios-cotizacion'

type Props = {
  cartaInicial?: CartaCotizacionId
  asistentesIniciales?: number
  duracionInicial?: DuracionCotizacion
  packInicial?: CartaCotizacionId
  modoInicial?: 'flexible'
}

const WHATSAPP_COMERCIAL = process.env.NEXT_PUBLIC_WHATSAPP ?? ''
const PASOS = ['Elegir servicio', 'Datos del evento', 'Tus datos'] as const
const ORDEN_PACKS: CartaCotizacionId[] = ['reducida', 'completa', 'sin-alcohol']
const DURACION_MINIMA = CONFIG_COTIZACION.duraciones[0]
const DURACION_MAXIMA = CONFIG_COTIZACION.duraciones[CONFIG_COTIZACION.duraciones.length - 1]
const OTRA_COMUNA = 'otra'
const COMUNAS_POR_PROVINCIA = [
  { provincia: 'Provincia de Santiago', comunas: ['Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Santiago', 'Vitacura'] },
  { provincia: 'Chacabuco', comunas: ['Colina', 'Lampa', 'Tiltil'] },
  { provincia: 'Cordillera', comunas: ['Pirque', 'Puente Alto', 'San José de Maipo'] },
  { provincia: 'Maipo', comunas: ['Buin', 'Calera de Tango', 'Paine', 'San Bernardo'] },
  { provincia: 'Melipilla', comunas: ['Alhué', 'Curacaví', 'María Pinto', 'Melipilla', 'San Pedro'] },
  { provincia: 'Talagante', comunas: ['El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor', 'Talagante'] },
] as const

export function CotizacionForm({ cartaInicial, asistentesIniciales, duracionInicial, packInicial, modoInicial }: Props) {
  const flujoRef = useRef<HTMLDivElement>(null)
  const [paso, setPaso] = useState<1 | 2 | 3>(packInicial ? 2 : 1)
  const [modo, setModo] = useState<'pack' | 'flexible' | null>(packInicial ? 'pack' : modoInicial ?? null)
  const [fecha, setFecha] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [otraCiudad, setOtraCiudad] = useState('')
  const [asistentes, setAsistentes] = useState(String(asistentesIniciales ?? CONFIG_COTIZACION.personasBase))
  const [cartaId, setCartaId] = useState<CartaCotizacionId>(packInicial ?? cartaInicial ?? 'reducida')
  const [duracion, setDuracion] = useState<DuracionCotizacion>(packInicial ? 5 : duracionInicial ?? 5)
  const [posicionHoras, setPosicionHoras] = useState<number>(packInicial ? 5 : duracionInicial ?? 5)
  const posicionHorasRef = useRef<number>(packInicial ? 5 : duracionInicial ?? 5)
  const punteroActivoRef = useRef<number | null>(null)
  const animacionHorasRef = useRef<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [solicitaCartaDigital, setSolicitaCartaDigital] = useState(false)
  const [errorEvento, setErrorEvento] = useState('')
  const [errorContacto, setErrorContacto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [cotizacionEnviada, setCotizacionEnviada] = useState(false)

  const numeroAsistentes = Number(asistentes)
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === cartaId)
  const ciudadCotizacion = ciudad === OTRA_COMUNA ? otraCiudad.trim() : ciudad
  const fechaVisible = fecha ? fecha.split('-').reverse().join('/') : 'Por definir'
  const progresoHoras = (posicionHoras - DURACION_MINIMA) / (DURACION_MAXIMA - DURACION_MINIMA)

  useEffect(() => () => {
    if (animacionHorasRef.current !== null) cancelAnimationFrame(animacionHorasRef.current)
  }, [])

  useLayoutEffect(() => {
    if (paso !== 3) return

    const frame = requestAnimationFrame(() => {
      const flujo = flujoRef.current
      if (!flujo) return

      const altoVisible = window.visualViewport?.height ?? window.innerHeight
      const altoCabecera = document.querySelector<HTMLElement>('.cabecera')?.getBoundingClientRect().height ?? 0
      const margen = 16
      const espacioDisponible = Math.max(0, altoVisible - altoCabecera - margen * 2)
      const rectangulo = flujo.getBoundingClientRect()
      const posicionVisible = altoCabecera + margen + Math.max(0, (espacioDisponible - rectangulo.height) / 2)
      const destino = Math.max(0, window.scrollY + rectangulo.top - posicionVisible)

      if (Math.abs(window.scrollY - destino) > 12) {
        window.scrollTo({
          top: destino,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [paso])

  function detenerAnimacionHoras() {
    if (animacionHorasRef.current !== null) cancelAnimationFrame(animacionHorasRef.current)
    animacionHorasRef.current = null
  }

  function moverHoras(valor: number) {
    posicionHorasRef.current = valor
    setPosicionHoras(valor)
  }

  function elegirHora(valor: number) {
    return Math.min(DURACION_MAXIMA, Math.max(DURACION_MINIMA, Math.round(valor))) as DuracionCotizacion
  }

  function terminarArrastreHoras(evento: ReactPointerEvent<HTMLInputElement>) {
    if (punteroActivoRef.current !== evento.pointerId) return
    punteroActivoRef.current = null
    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) evento.currentTarget.releasePointerCapture(evento.pointerId)

    const inicio = posicionHorasRef.current
    const destino = elegirHora(inicio)
    setDuracion(destino)
    if (Math.abs(destino - inicio) < 0.005 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      moverHoras(destino)
      return
    }

    const comienzo = performance.now()
    function avanzar(ahora: number) {
      const progreso = Math.min(1, (ahora - comienzo) / 220)
      moverHoras(inicio + (destino - inicio) * (1 - Math.pow(1 - progreso, 3)))
      animacionHorasRef.current = progreso < 1 ? requestAnimationFrame(avanzar) : null
    }
    animacionHorasRef.current = requestAnimationFrame(avanzar)
  }

  const resumen = useMemo(() => {
    const contacto = [correo.trim() ? `Correo: ${correo.trim()}` : '', whatsapp.trim() ? `WhatsApp: ${whatsapp.trim()}` : '']
      .filter(Boolean)
      .join(' · ')

    return [
      'Hola, quiero cotizar una barra libre para mi evento.',
      '',
      `Nombre: ${nombre.trim() || '—'}`,
      contacto || 'Contacto: —',
      `Fecha: ${fechaVisible}`,
      `Ciudad o comuna: ${ciudadCotizacion || '—'}`,
      `Asistentes: ${asistentes || '—'}`,
      `Carta: ${carta?.nombre} (${carta?.bebidas} opciones)`,
      `Duración: ${duracion} horas`,
      `Servicio: barra libre durante las ${duracion} horas contratadas.`,
      solicitaCartaDigital
        ? 'Carta digital con branding: sí, la solicito sin costo y con al menos 5 días de anticipación.'
        : 'Beneficio opcional: carta digital con branding sin costo, solicitándola con al menos 5 días de anticipación.',
    ].join('\n')
  }, [
    asistentes,
    carta,
    ciudad,
    ciudadCotizacion,
    correo,
    duracion,
    fechaVisible,
    nombre,
    solicitaCartaDigital,
    whatsapp,
  ])

  const numeroWhatsApp = WHATSAPP_COMERCIAL.replace(/\D/g, '')
  const enlaceWhatsApp = numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(resumen)}`
    : ''

  function validarEvento(): boolean {
    if (!fecha || !Number.isSafeInteger(numeroAsistentes)) {
      setErrorEvento('Completa la fecha y un número válido de asistentes.')
      return false
    }
    if (!asistentesEnRango(numeroAsistentes)) {
      setErrorEvento(`Elige entre ${CONFIG_COTIZACION.asistentesMin} y ${CONFIG_COTIZACION.asistentesMax} invitados.`)
      return false
    }
    setErrorEvento('')
    return true
  }

  function validarContacto(): boolean {
    const correoLimpio = correo.trim()
    const digitosWhatsApp = whatsapp.replace(/\D/g, '')
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)
    const telefonoValido = digitosWhatsApp.length >= 8 && digitosWhatsApp.length <= 15

    if (nombre.trim().length < 2) {
      setErrorContacto('Escribe tu nombre para identificar la cotización.')
      return false
    }
    if (!ciudadCotizacion) {
      setErrorContacto('Selecciona la ciudad o comuna del evento.')
      return false
    }
    if (!correoLimpio) {
      setErrorContacto('Ingresa tu correo para recibir la cotización y la carta en PDF.')
      return false
    }
    if (correoLimpio && !correoValido) {
      setErrorContacto('Revisa el formato del correo que ingresaste.')
      return false
    }
    if (whatsapp.trim() && !telefonoValido) {
      setErrorContacto('Ingresa un número de WhatsApp válido, con código de país si corresponde.')
      return false
    }

    setErrorContacto('')
    return true
  }

  function validarAntesDeEnviar(evento: MouseEvent<HTMLAnchorElement>) {
    if (!validarContacto()) evento.preventDefault()
  }

  async function enviarPorCorreo() {
    if (!validarContacto()) return

    setEnviando(true)
    setErrorEnvio('')

    try {
      const respuesta = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          whatsapp: whatsapp.trim(),
          fecha,
          ciudad: ciudadCotizacion,
          lugar: '',
          asistentes: numeroAsistentes,
          cartaId,
          detalleCarta: '',
          duracion,
          modo: modo ?? 'flexible',
          solicitaCartaDigital,
        }),
      })
      const resultado = await respuesta.json().catch(() => null) as { error?: string } | null

      if (!respuesta.ok) {
        setErrorEnvio(resultado?.error ?? 'No pudimos enviar la solicitud. Inténtalo otra vez o contáctanos directamente.')
        return
      }

      setCotizacionEnviada(true)
    } catch {
      setErrorEnvio('No pudimos conectar con el servicio de correo. Inténtalo otra vez o contáctanos directamente.')
    } finally {
      setEnviando(false)
    }
  }

  function reiniciarCotizador() {
    detenerAnimacionHoras()
    punteroActivoRef.current = null
    setPaso(1)
    setModo(null)
    setFecha('')
    setCiudad('')
    setOtraCiudad('')
    setAsistentes(String(CONFIG_COTIZACION.personasBase))
    setCartaId('reducida')
    setDuracion(5)
    moverHoras(5)
    setNombre('')
    setCorreo('')
    setWhatsapp('')
    setSolicitaCartaDigital(false)
    setErrorEvento('')
    setErrorContacto('')
    setErrorEnvio('')
    setCotizacionEnviada(false)
  }

  return (
    <div className="cotizacion-flujo" ref={flujoRef}>
      {!cotizacionEnviada ? (
        <>
          <ol className="cotizacion-flujo__progreso" aria-label="Pasos de la cotización">
        {PASOS.map((etiqueta, indice) => {
          const numeroPaso = (indice + 1) as 1 | 2 | 3
          return (
            <li
              className={paso === numeroPaso ? 'cotizacion-flujo__paso cotizacion-flujo__paso--activo' : 'cotizacion-flujo__paso'}
              aria-current={paso === numeroPaso ? 'step' : undefined}
              key={etiqueta}
            >
              <span className="cotizacion-flujo__numero">{numeroPaso}</span>
              <span>{etiqueta}</span>
              </li>
            )
          })}
          </ol>

      {paso === 1 ? (
        <section className="cotizacion-flujo__panel" aria-labelledby="cotizacion-paso-1">
          <div className="cotizacion-flujo__encabezado">
            <p className="micro">Paso 1 de 3</p>
            <h2 className="h3" id="cotizacion-paso-1">Elige tu servicio</h2>
            <p>Escoge un pack de 5 horas o arma tu propia ruta de barra libre.</p>
          </div>
          <div className="cotizacion-flujo__servicios" role="group" aria-label="Tipo de servicio">
            {ORDEN_PACKS.map((id) => CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === id)!).map((opcion) => (
              <button className={modo === 'pack' && cartaId === opcion.id ? 'cotizacion-flujo__servicio cotizacion-flujo__servicio--activo' : 'cotizacion-flujo__servicio'} type="button" key={opcion.id} aria-pressed={modo === 'pack' && cartaId === opcion.id} onClick={() => { setModo('pack'); setCartaId(opcion.id); setDuracion(5); moverHoras(5); setPaso(2) }}>
                <strong>{opcion.nombre}</strong><span>{opcion.bebidas} opciones · 5 horas</span>
              </button>
            ))}
            <button className={modo === 'flexible' ? 'cotizacion-flujo__servicio cotizacion-flujo__servicio--activo' : 'cotizacion-flujo__servicio'} type="button" aria-pressed={modo === 'flexible'} onClick={() => { setModo('flexible'); setPaso(2) }}>
              <strong>La carta y las horas que tú quieras</strong><span>Elige carta y duración entre 3 y 12 horas</span>
            </button>
          </div>
        </section>
      ) : null}

      {paso === 2 ? (
        <section className="cotizacion-flujo__panel" aria-labelledby="cotizacion-paso-2">
          <div className="cotizacion-flujo__encabezado">
            <p className="micro">Paso 2 de 3</p>
            <h2 className="h3" id="cotizacion-paso-2">Datos del evento</h2>
            <p>{modo === 'pack' ? `Elegiste ${carta?.nombre}: ${carta?.bebidas} opciones y 5 horas de barra libre.` : 'Escoge la carta y duración, y cuéntanos sobre tu evento.'}</p>
          </div>
          {modo === 'flexible' ? (
            <>
              <label className="campo cotizacion-flujo__carta-select">
                <span className="campo__label">Tipo de carta</span>
                <select className="campo__input" value={cartaId} onChange={(evento) => setCartaId(evento.target.value as CartaCotizacionId)}>
                  {CONFIG_COTIZACION.cartas.map((opcion) => <option value={opcion.id} key={opcion.id}>{opcion.nombre} · {opcion.bebidas} opciones</option>)}
                </select>
                <span className="cotizacion-flujo__ayuda">{carta?.resumen}</span>
              </label>
          <div className="cotizacion-flujo__horas">
            <div className="cotizacion-flujo__horas-encabezado">
              <label htmlFor="duracion-cotizacion">Cantidad de horas</label>
              <output htmlFor="duracion-cotizacion">{duracion} horas</output>
            </div>
            <div
              className="cotizacion-flujo__horas-control"
              style={{
                '--horas-progreso': `${progresoHoras * 100}%`,
                '--horas-pulso-offset': `${(1 - 2 * progresoHoras) * 0.85}rem`,
              } as CSSProperties}
            >
              <span className="cotizacion-flujo__horas-pulso" aria-hidden="true" />
              <input
                id="duracion-cotizacion"
                className="cotizacion-flujo__horas-deslizador"
                type="range"
                min={DURACION_MINIMA}
                max={DURACION_MAXIMA}
                step="any"
                value={posicionHoras}
                aria-valuetext={`${duracion} horas`}
                onChange={(evento) => {
                  const valor = Number(evento.target.value)
                  const elegida = elegirHora(valor)
                  setDuracion(elegida)
                  moverHoras(punteroActivoRef.current === null ? elegida : valor)
                }}
                onPointerDown={(evento) => {
                  if (punteroActivoRef.current !== null) return
                  detenerAnimacionHoras()
                  punteroActivoRef.current = evento.pointerId
                  evento.currentTarget.setPointerCapture(evento.pointerId)
                }}
                onPointerUp={terminarArrastreHoras}
                onPointerCancel={terminarArrastreHoras}
                onKeyDown={(evento) => {
                  const cambio = evento.key === 'ArrowRight' || evento.key === 'ArrowUp' || evento.key === 'PageUp' ? 1
                    : evento.key === 'ArrowLeft' || evento.key === 'ArrowDown' || evento.key === 'PageDown' ? -1 : 0
                  const destino = evento.key === 'Home' ? DURACION_MINIMA : evento.key === 'End' ? DURACION_MAXIMA
                    : cambio ? elegirHora(duracion + cambio) : null
                  if (destino === null) return
                  evento.preventDefault()
                  detenerAnimacionHoras()
                  setDuracion(destino)
                  moverHoras(destino)
                }}
              />
            </div>
            <div className="cotizacion-flujo__horas-marcas" aria-hidden="true">
              {CONFIG_COTIZACION.duraciones.map((opcion) => <span className={opcion === duracion ? 'cotizacion-flujo__horas-marca--activa' : undefined} key={opcion} />)}
            </div>
            <div className="cotizacion-flujo__horas-extremos" aria-hidden="true">
              <span>{DURACION_MINIMA} h</span>
              <span>{DURACION_MAXIMA} h</span>
            </div>
          </div>

            </>
          ) : (
            <div className="cotizacion-flujo__pack-elegido"><strong>{carta?.nombre}</strong><span>{carta?.resumen}</span><small>5 horas · Barra libre</small></div>
          )}
          <div className="cotizacion-flujo__campos">
            <label className="campo cotizacion-flujo__campo-evento">
              <span className="campo__label">Fecha del evento <span className="campo__valor">*</span></span>
              <input className="campo__input" type="date" lang="es-CL" value={fecha} onInput={(evento) => { setFecha(evento.currentTarget.value); setErrorEvento('') }} onChange={(evento) => setFecha(evento.target.value)} required />
            </label>
            <label className="campo cotizacion-flujo__campo-evento">
              <span className="campo__label">Número de asistentes <span className="campo__valor">*</span></span>
              <input className="campo__input" type="number" min={CONFIG_COTIZACION.asistentesMin} max={CONFIG_COTIZACION.asistentesMax} step={1} inputMode="numeric" value={asistentes} onChange={(evento) => { setAsistentes(evento.target.value); setErrorEvento('') }} required />
              <span className="cotizacion-flujo__ayuda">Entre {CONFIG_COTIZACION.asistentesMin} y {CONFIG_COTIZACION.asistentesMax} invitados.</span>
            </label>
          </div>
          {errorEvento ? <p className="cotizacion-flujo__error" role="alert">{errorEvento}</p> : null}
          <div className="cotizacion-flujo__acciones">
            <button className="boton boton--fantasma" type="button" onClick={() => setPaso(1)}>Cambiar servicio</button>
            <button className="boton" type="button" onClick={() => { if (validarEvento()) setPaso(3) }}>Continuar</button>
          </div>
        </section>
      ) : null}

      {paso === 3 ? (
        <section className="cotizacion-flujo__panel" aria-labelledby="cotizacion-paso-3">
          <div className="cotizacion-flujo__encabezado">
            <p className="micro">Paso 3 de 3</p>
            <h2 className="h3" id="cotizacion-paso-3">Tus datos</h2>
            <p>Indícanos dónde será el evento y a qué correo enviamos tu cotización en PDF.</p>
          </div>

          <div className="cotizacion-flujo__campos">
            <label className="campo">
              <span className="campo__label">Nombre <span className="campo__valor">*</span></span>
              <input className="campo__input" value={nombre} onChange={(evento) => { setNombre(evento.target.value); setErrorContacto('') }} autoComplete="name" required />
            </label>
            <label className="campo">
              <span className="campo__label">Ciudad o comuna del evento <span className="campo__valor">*</span></span>
              <select className="campo__input" value={ciudad} onChange={(evento) => { setCiudad(evento.target.value); setErrorContacto('') }} autoComplete="address-level2" required>
                <option value="" disabled>Selecciona una comuna</option>
                {COMUNAS_POR_PROVINCIA.map((grupo) => (
                  <optgroup label={grupo.provincia} key={grupo.provincia}>
                    {grupo.comunas.map((comuna) => <option value={comuna} key={comuna}>{comuna}</option>)}
                  </optgroup>
                ))}
                <option value={OTRA_COMUNA}>Otra ciudad o comuna</option>
              </select>
            </label>
            {ciudad === OTRA_COMUNA ? (
              <label className="campo">
                <span className="campo__label">Indica la ciudad o comuna <span className="campo__valor">*</span></span>
                <input className="campo__input" value={otraCiudad} onChange={(evento) => { setOtraCiudad(evento.target.value); setErrorContacto('') }} autoComplete="address-level2" required />
              </label>
            ) : null}
            <label className="campo">
              <span className="campo__label">Correo para recibir tu cotización <span className="campo__valor">*</span></span>
              <input className="campo__input" type="email" value={correo} onChange={(evento) => { setCorreo(evento.target.value); setErrorContacto('') }} autoComplete="email" placeholder="tu@correo.cl" required />
            </label>
            <label className="campo">
              <span className="campo__label">Número de WhatsApp <span className="campo__opcional">Opcional</span></span>
              <input className="campo__input" type="tel" value={whatsapp} onChange={(evento) => { setWhatsapp(evento.target.value); setErrorContacto('') }} autoComplete="tel" inputMode="tel" placeholder="+56 9 1234 5678" />
            </label>
          </div>
          <p className="cotizacion-flujo__ayuda">El precio final, el detalle y la carta llegarán a ese correo.</p>

          <label className="cotizacion-flujo__beneficio">
            <input type="checkbox" checked={solicitaCartaDigital} onChange={(evento) => setSolicitaCartaDigital(evento.target.checked)} />
            <span><strong>Quiero la carta digital con branding.</strong> Es sin costo y puedes solicitarla con al menos 5 días de anticipación.</span>
          </label>

          {errorContacto ? <p className="cotizacion-flujo__error" role="alert">{errorContacto}</p> : null}

          {errorEnvio ? <p className="cotizacion-flujo__error" role="alert">{errorEnvio}</p> : null}

          <div className={enlaceWhatsApp ? 'cotizacion-flujo__envio cotizacion-flujo__envio--whatsapp' : 'cotizacion-flujo__envio'}>
            <button className="boton" type="button" onClick={enviarPorCorreo} disabled={enviando}>
              {enviando ? 'Preparando tu PDF…' : 'Recibir cotización por correo'}
            </button>
            {enlaceWhatsApp ? (
              <a className="boton boton--fantasma" href={enlaceWhatsApp} onClick={validarAntesDeEnviar} rel="noopener noreferrer" target="_blank">
                Consultar por WhatsApp
              </a>
            ) : null}
          </div>

          <div className="cotizacion-flujo__acciones">
            <button className="boton boton--fantasma" type="button" onClick={() => setPaso(2)}>Volver a datos del evento</button>
          </div>
        </section>
      ) : null}
        </>
      ) : (
        <section className="cotizacion-flujo__exito" role="status" aria-labelledby="cotizacion-enviada-titulo">
          <div className="cotizacion-flujo__confeti" aria-hidden="true">
            {Array.from({ length: 20 }, (_, indice) => (
              <span
                className={`cotizacion-flujo__confeti-pieza cotizacion-flujo__confeti-pieza--${indice % 4}`}
                key={indice}
                style={{
                  left: `${(indice * 31) % 100}%`,
                  animationDelay: `${(indice % 8) * 65}ms`,
                  '--confeti-deriva': `${((indice * 17) % 70) - 35}px`,
                  '--confeti-giro': `${((indice * 53) % 240) - 120}deg`,
                } as CSSProperties & { '--confeti-deriva': string; '--confeti-giro': string }}
              />
            ))}
          </div>
          <figure className="cotizacion-flujo__exito-gif">
            <img
              src="/celebracion-cotizacion.webp"
              alt="Jimmy Fallon aplaude para celebrar el envío de la cotización"
              width={480}
              height={270}
            />
          </figure>
          <div className="cotizacion-flujo__exito-contenido">
            <h2 className="h2" id="cotizacion-enviada-titulo">¡Cotización enviada!</h2>
            <p className="lead">{`Gracias, ${nombre.trim()}. Revisa tu correo: enviamos el precio y la carta en PDF.`}</p>
            <button className="boton" type="button" onClick={reiniciarCotizador}>Cotizar otro evento</button>
          </div>
        </section>
      )}
    </div>
  )
}
