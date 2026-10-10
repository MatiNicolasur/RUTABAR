'use client'

import { useMemo, useState, type CSSProperties, type MouseEvent } from 'react'
import { CONFIG_COTIZACION, calcularPrecioCotizacion, type CartaCotizacionId, type DuracionCotizacion } from '@/data/precios-cotizacion'
import { PAGO } from '@/data/pago'
import { clp, numero } from '@/lib/formato'

type Props = {
  cartaInicial?: CartaCotizacionId
  asistentesIniciales?: number
  duracionInicial?: DuracionCotizacion
}

const WHATSAPP_COMERCIAL = process.env.NEXT_PUBLIC_WHATSAPP ?? ''
const PASOS = ['Datos del evento', 'Elegir servicio', 'Revisar y enviar'] as const
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

export function CotizacionForm({ cartaInicial, asistentesIniciales, duracionInicial }: Props) {
  const [paso, setPaso] = useState<1 | 2 | 3>(1)
  const [fecha, setFecha] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [otraCiudad, setOtraCiudad] = useState('')
  const [lugar, setLugar] = useState('')
  const [asistentes, setAsistentes] = useState(String(asistentesIniciales ?? CONFIG_COTIZACION.personasBase))
  const [cartaId, setCartaId] = useState<CartaCotizacionId>(cartaInicial ?? 'reducida')
  const [duracion, setDuracion] = useState<DuracionCotizacion>(duracionInicial ?? 4)
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
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === cartaId) ?? CONFIG_COTIZACION.cartas[1]
  const ciudadCotizacion = ciudad === OTRA_COMUNA ? otraCiudad.trim() : ciudad
  const total = useMemo(
    () => calcularPrecioCotizacion(cartaId, duracion, numeroAsistentes),
    [cartaId, duracion, numeroAsistentes],
  )
  const porPersona = numeroAsistentes > 0 ? Math.round(total / numeroAsistentes) : 0
  const montoReserva = Math.round((total * PAGO.reservaPct) / 100)
  const montoSaldo = total - montoReserva
  const fechaVisible = fecha ? fecha.split('-').reverse().join('/') : 'Por definir'
  const progresoHoras = (duracion - DURACION_MINIMA) / (DURACION_MAXIMA - DURACION_MINIMA)

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
      `Lugar: ${lugar.trim() || '—'}`,
      `Asistentes: ${asistentes || '—'}`,
      `Carta: ${carta.nombre} (${carta.bebidas} bebidas)`,
      `Duración: ${duracion} horas`,
      `Servicio: barra libre durante las ${duracion} horas contratadas.`,
      `Total final con IVA incluido: ${clp(total)}`,
      `Precio por persona: ${clp(porPersona)}`,
      `Pago: ${PAGO.reservaPct}% para reservar ${clp(montoReserva)} + ${PAGO.saldoPct}% el día del evento ${clp(montoSaldo)} = ${clp(total)}.`,
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
    lugar,
    montoReserva,
    montoSaldo,
    nombre,
    porPersona,
    solicitaCartaDigital,
    total,
    whatsapp,
  ])

  const numeroWhatsApp = WHATSAPP_COMERCIAL.replace(/\D/g, '')
  const enlaceWhatsApp = numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(resumen)}`
    : ''

  function validarEvento(): boolean {
    if (!fecha || !ciudadCotizacion || !lugar.trim() || !Number.isSafeInteger(numeroAsistentes) || numeroAsistentes < 1) {
      setErrorEvento('Completa la fecha, la ciudad o comuna, el lugar y un número válido de asistentes.')
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
    if (!correoLimpio && !whatsapp.trim()) {
      setErrorContacto('Indica un correo o un número de WhatsApp para poder responderte.')
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
          lugar: lugar.trim(),
          asistentes: numeroAsistentes,
          cartaId,
          duracion,
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
    setPaso(1)
    setFecha('')
    setCiudad('')
    setOtraCiudad('')
    setLugar('')
    setAsistentes(String(CONFIG_COTIZACION.personasBase))
    setCartaId('reducida')
    setDuracion(4)
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
    <div className="cotizacion-flujo">
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
            <h2 className="h3" id="cotizacion-paso-1">Datos del evento</h2>
            <p>Cuéntanos dónde será y cuántas personas asistirán.</p>
          </div>

          <div className="cotizacion-flujo__campos">
            <label className="campo">
              <span className="campo__label">Fecha del evento <span className="campo__valor">*</span></span>
              <input className="campo__input" type="date" lang="es-CL" value={fecha} onChange={(evento) => setFecha(evento.target.value)} required />
            </label>
            <label className="campo">
              <span className="campo__label">Ciudad o comuna <span className="campo__valor">*</span></span>
              <select className="campo__input" value={ciudad} onChange={(evento) => setCiudad(evento.target.value)} autoComplete="address-level2" required>
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
                <input className="campo__input" value={otraCiudad} onChange={(evento) => setOtraCiudad(evento.target.value)} autoComplete="address-level2" required />
              </label>
            ) : null}
            <label className="campo">
              <span className="campo__label">Lugar <span className="campo__valor">*</span></span>
              <input className="campo__input" value={lugar} onChange={(evento) => setLugar(evento.target.value)} placeholder="Casa, salón, terraza…" required />
            </label>
            <label className="campo">
              <span className="campo__label">Número de asistentes <span className="campo__valor">*</span></span>
              <input className="campo__input" type="number" min={1} step={1} inputMode="numeric" value={asistentes} onChange={(evento) => setAsistentes(evento.target.value)} required />
            </label>
          </div>

          {errorEvento ? <p className="cotizacion-flujo__error" role="alert">{errorEvento}</p> : null}
          <div className="cotizacion-flujo__acciones cotizacion-flujo__acciones--final">
            <button className="boton" type="button" onClick={() => { if (validarEvento()) setPaso(2) }}>
              Continuar a elegir servicio
            </button>
          </div>
        </section>
      ) : null}

      {paso === 2 ? (
        <section className="cotizacion-flujo__panel" aria-labelledby="cotizacion-paso-2">
          <div className="cotizacion-flujo__encabezado">
            <p className="micro">Paso 2 de 3</p>
            <h2 className="h3" id="cotizacion-paso-2">Elegir servicio</h2>
            <p>El total se actualiza al cambiar la carta, las horas o los asistentes.</p>
          </div>

          <label className="campo cotizacion-flujo__carta-select">
            <span className="campo__label">Tipo de carta</span>
            <select className="campo__input" value={cartaId} onChange={(evento) => setCartaId(evento.target.value as CartaCotizacionId)}>
              {CONFIG_COTIZACION.cartas.map((opcion) => (
                <option value={opcion.id} key={opcion.id}>{opcion.nombre} · {opcion.bebidas} opciones</option>
              ))}
            </select>
            <span className="cotizacion-flujo__ayuda">{carta.resumen}</span>
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
                step={1}
                value={duracion}
                aria-valuetext={`${duracion} horas`}
                onChange={(evento) => setDuracion(Number(evento.target.value) as DuracionCotizacion)}
              />
            </div>
            <div className="cotizacion-flujo__horas-extremos" aria-hidden="true">
              <span>{DURACION_MINIMA} h</span>
              <span>{DURACION_MAXIMA} h</span>
            </div>
          </div>

          <div className="cotizacion-flujo__precio" aria-live="polite" aria-atomic="true">
            <p className="micro">Total final con IVA incluido</p>
            <p className="cotizacion-flujo__total">{clp(total)}</p>
            <p className="cotizacion-flujo__por-persona">{clp(porPersona)} por persona · {numero(numeroAsistentes)} asistentes</p>
            <p className="cotizacion-flujo__formula">
              Precio de referencia para {CONFIG_COTIZACION.personasBase} personas, ajustado proporcionalmente según asistentes.
            </p>
          </div>

          <div className="cotizacion-flujo__acciones">
            <button className="boton boton--fantasma" type="button" onClick={() => setPaso(1)}>Volver</button>
            <button className="boton" type="button" onClick={() => setPaso(3)}>Continuar a revisar</button>
          </div>
        </section>
      ) : null}

      {paso === 3 ? (
        <section className="cotizacion-flujo__panel" aria-labelledby="cotizacion-paso-3">
          <div className="cotizacion-flujo__encabezado">
            <p className="micro">Paso 3 de 3</p>
            <h2 className="h3" id="cotizacion-paso-3">Revisar y enviar</h2>
            <p>Déjanos un dato de contacto para enviarte el detalle de tu cotización.</p>
          </div>

          <div className="cotizacion-flujo__campos">
            <label className="campo">
              <span className="campo__label">Nombre <span className="campo__valor">*</span></span>
              <input className="campo__input" value={nombre} onChange={(evento) => { setNombre(evento.target.value); setErrorContacto('') }} autoComplete="name" required />
            </label>
            <label className="campo">
              <span className="campo__label">Correo <span className="campo__opcional">Opcional</span></span>
              <input className="campo__input" type="email" value={correo} onChange={(evento) => { setCorreo(evento.target.value); setErrorContacto('') }} autoComplete="email" placeholder="tu@correo.cl" />
            </label>
            <label className="campo">
              <span className="campo__label">Número de WhatsApp <span className="campo__opcional">Opcional</span></span>
              <input className="campo__input" type="tel" value={whatsapp} onChange={(evento) => { setWhatsapp(evento.target.value); setErrorContacto('') }} autoComplete="tel" inputMode="tel" placeholder="+56 9 1234 5678" />
            </label>
          </div>
          <p className="cotizacion-flujo__ayuda">Ingresa al menos un correo o número de WhatsApp para que podamos responderte.</p>

          <label className="cotizacion-flujo__beneficio">
            <input type="checkbox" checked={solicitaCartaDigital} onChange={(evento) => setSolicitaCartaDigital(evento.target.checked)} />
            <span><strong>Quiero la carta digital con branding.</strong> Es sin costo y puedes solicitarla con al menos 5 días de anticipación.</span>
          </label>

          {errorContacto ? <p className="cotizacion-flujo__error" role="alert">{errorContacto}</p> : null}

          {errorEnvio ? <p className="cotizacion-flujo__error" role="alert">{errorEnvio}</p> : null}

          <div className={enlaceWhatsApp ? 'cotizacion-flujo__envio cotizacion-flujo__envio--whatsapp' : 'cotizacion-flujo__envio'}>
            <button className="boton" type="button" onClick={enviarPorCorreo} disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar por correo'}
            </button>
            {enlaceWhatsApp ? (
              <a className="boton boton--fantasma" href={enlaceWhatsApp} onClick={validarAntesDeEnviar} rel="noopener noreferrer" target="_blank">
                Enviar por WhatsApp
              </a>
            ) : null}
          </div>

          <div className="cotizacion-flujo__acciones">
            <button className="boton boton--fantasma" type="button" onClick={() => setPaso(2)}>Volver a elegir servicio</button>
          </div>
        </section>
      ) : null}
        </>
      ) : (
        <section className="cotizacion-flujo__exito" role="status" aria-labelledby="cotizacion-enviada-titulo">
          <div className="cotizacion-flujo__confeti" aria-hidden="true">
            {Array.from({ length: 32 }, (_, indice) => (
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
          <div className="cotizacion-flujo__exito-contenido">
            <p className="micro">Solicitud enviada</p>
            <h2 className="h2" id="cotizacion-enviada-titulo">Gracias, {nombre.trim()}.</h2>
            <p className="lead">Recibimos los datos de tu evento. Nuestro equipo revisará la fecha y te responderá con la cotización final.</p>
            <div className="cotizacion-flujo__exito-total">
              <span>{carta.nombre} · {duracion} horas · {numero(numeroAsistentes)} asistentes</span>
              <strong>{clp(total)} con IVA incluido</strong>
            </div>
            <button className="boton" type="button" onClick={reiniciarCotizador}>Cotizar otro evento</button>
          </div>
          <figure className="cotizacion-flujo__exito-gif">
            <img
              src="/celebracion-cotizacion.gif"
              alt="Jimmy Fallon aplaude para celebrar el envío de la cotización"
              width={480}
              height={270}
            />
          </figure>
        </section>
      )}
    </div>
  )
}
