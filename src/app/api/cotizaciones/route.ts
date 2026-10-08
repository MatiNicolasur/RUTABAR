import { CONFIG_COTIZACION, calcularPrecioCotizacion, type CartaCotizacionId, type DuracionCotizacion } from '@/data/precios-cotizacion'
import { PAGO } from '@/data/pago'
import { clp } from '@/lib/formato'

export const runtime = 'nodejs'

type DatosCotizacion = {
  nombre: string
  correo: string
  whatsapp: string
  fecha: string
  ciudad: string
  lugar: string
  asistentes: number
  cartaId: CartaCotizacionId
  duracion: DuracionCotizacion
  solicitaCartaDigital: boolean
}

function esTexto(valor: unknown, maximo: number): valor is string {
  return typeof valor === 'string' && valor.trim().length > 0 && valor.trim().length <= maximo
}

function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (caracter) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[caracter] ?? caracter)
}

function validarDatos(valor: unknown): DatosCotizacion | null {
  if (!valor || typeof valor !== 'object') return null
  const entrada = valor as Record<string, unknown>
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === entrada.cartaId)
  const duracion = CONFIG_COTIZACION.duraciones.find((opcion) => opcion === entrada.duracion)
  const correo = typeof entrada.correo === 'string' ? entrada.correo.trim() : ''
  const whatsapp = typeof entrada.whatsapp === 'string' ? entrada.whatsapp.trim() : ''
  const fechaValida = typeof entrada.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entrada.fecha)
  const correoValido = !correo || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
  const digitosWhatsapp = whatsapp.replace(/\D/g, '')
  const whatsappValido = !whatsapp || (digitosWhatsapp.length >= 8 && digitosWhatsapp.length <= 15)

  if (
    !carta || !duracion ||
    !esTexto(entrada.nombre, 100) ||
    !correoValido || !whatsappValido || (!correo && !whatsapp) ||
    !fechaValida ||
    !esTexto(entrada.ciudad, 100) ||
    !esTexto(entrada.lugar, 160) ||
    !Number.isSafeInteger(entrada.asistentes) || Number(entrada.asistentes) < 1 || Number(entrada.asistentes) > 10_000 ||
    typeof entrada.solicitaCartaDigital !== 'boolean'
  ) return null

  return {
    nombre: entrada.nombre.trim(),
    correo,
    whatsapp,
    fecha: String(entrada.fecha),
    ciudad: entrada.ciudad.trim(),
    lugar: entrada.lugar.trim(),
    asistentes: Number(entrada.asistentes),
    cartaId: carta.id,
    duracion,
    solicitaCartaDigital: entrada.solicitaCartaDigital,
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const remitente = process.env.RESEND_FROM_EMAIL
  const destinatario = process.env.RESEND_TO_EMAIL || process.env.NEXT_PUBLIC_EMAIL || 'contacto@rutabar.cl'

  if (!apiKey || !remitente) {
    return Response.json(
      { error: 'El envío por correo todavía no está configurado. Escríbenos a contacto@rutabar.cl mientras lo conectamos.' },
      { status: 503 },
    )
  }

  let cuerpo: unknown
  try {
    cuerpo = await request.json()
  } catch {
    return Response.json({ error: 'No pudimos leer los datos de la cotización.' }, { status: 400 })
  }

  const datos = validarDatos(cuerpo)
  if (!datos) {
    return Response.json({ error: 'Revisa los datos de contacto y del evento antes de enviar.' }, { status: 400 })
  }

  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === datos.cartaId)!
  const total = calcularPrecioCotizacion(datos.cartaId, datos.duracion, datos.asistentes)
  const porPersona = Math.round(total / datos.asistentes)
  const montoReserva = Math.round((total * PAGO.reservaPct) / 100)
  const montoSaldo = total - montoReserva
  const fechaVisible = datos.fecha.split('-').reverse().join('/')
  const filas: [string, string][] = [
    ['Nombre', datos.nombre],
    ['Correo', datos.correo || 'No indicado'],
    ['WhatsApp', datos.whatsapp || 'No indicado'],
    ['Fecha', fechaVisible],
    ['Ciudad o comuna', datos.ciudad],
    ['Lugar', datos.lugar],
    ['Asistentes', String(datos.asistentes)],
    ['Carta', `${carta.nombre} (${carta.bebidas} bebidas)`],
    ['Duración', `${datos.duracion} horas`],
    ['Servicio', `Barra libre durante las ${datos.duracion} horas contratadas`],
    ['Total final con IVA', clp(total)],
    ['Precio por persona', clp(porPersona)],
    [`${PAGO.reservaPct}% para reservar`, clp(montoReserva)],
    [`${PAGO.saldoPct}% el día del evento`, clp(montoSaldo)],
    ['Pago', `${clp(montoReserva)} + ${clp(montoSaldo)} = ${clp(total)}`],
    ['Carta digital con branding', datos.solicitaCartaDigital ? 'Solicitada, sin costo y con al menos 5 días de anticipación' : 'Disponible sin costo, solicitándola con al menos 5 días de anticipación'],
  ]
  const detalleTexto = filas.map(([etiqueta, contenido]) => `${etiqueta}: ${contenido}`).join('\n')
  const detalleHtml = filas.map(([etiqueta, contenido]) =>
    `<tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #f0dadd;color:#6b5254">${escaparHtml(etiqueta)}</th><td style="padding:8px 12px;border-bottom:1px solid #f0dadd">${escaparHtml(contenido)}</td></tr>`,
  ).join('')

  try {
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: remitente,
        to: [destinatario],
        ...(datos.correo ? { reply_to: datos.correo } : {}),
        subject: `Nueva cotización · ${carta.nombre} · ${fechaVisible}`,
        text: `Nueva solicitud de cotización para RUTABAR\n\n${detalleTexto}\n\nLa solicitud considera barra libre durante las horas contratadas.`,
        html: `<div style="font-family:Arial,sans-serif;color:#171313;max-width:680px;margin:0 auto"><div style="padding:24px;background:linear-gradient(120deg,#ffe5e7,#fff7f6);border-radius:16px"><p style="margin:0 0 8px;color:#a5001b;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">RUTABAR · Solicitud de cotización</p><h1 style="margin:0;font-size:28px">${escaparHtml(carta.nombre)} · ${datos.duracion} horas</h1></div><p style="line-height:1.6">Nueva solicitud de <strong>${escaparHtml(datos.nombre)}</strong>. El servicio solicitado es barra libre durante las horas contratadas.</p><table style="width:100%;border-collapse:collapse">${detalleHtml}</table></div>`,
      }),
      signal: AbortSignal.timeout(12_000),
    })

    if (!resend.ok) {
      return Response.json({ error: 'El correo no se pudo enviar en este momento. Inténtalo otra vez o escríbenos a contacto@rutabar.cl.' }, { status: 502 })
    }

    return Response.json({ enviado: true }, { status: 200 })
  } catch {
    return Response.json({ error: 'El correo no se pudo enviar en este momento. Inténtalo otra vez o escríbenos a contacto@rutabar.cl.' }, { status: 502 })
  }
}
