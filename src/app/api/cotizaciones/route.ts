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
  const remitente = process.env.RESEND_FROM_EMAIL || 'RUTABAR <contacto@barrabar.cl>'
  const destinatario = process.env.RESEND_TO_EMAIL || 'contacto@barrabar.cl'

  if (!apiKey) {
    return Response.json(
      { error: 'El envío por correo todavía no está configurado. Escríbenos a contacto@barrabar.cl mientras lo conectamos.' },
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
    `<tr><th scope="row" style="width:42%;padding:11px 12px;text-align:left;vertical-align:top;border-bottom:1px solid #f0dadd;color:#6b5254;font-size:13px;font-weight:600">${escaparHtml(etiqueta)}</th><td style="padding:11px 12px;vertical-align:top;border-bottom:1px solid #f0dadd;color:#262622;font-size:14px">${escaparHtml(contenido)}</td></tr>`,
  ).join('')
  const detalleTextoPlano = `Nueva solicitud de cotización para RUTABAR\n\n${detalleTexto}\n\nEl servicio consiste en barra libre durante las horas contratadas. El pago es ${PAGO.reservaPct}% para reservar (${clp(montoReserva)}) y ${PAGO.saldoPct}% el día del evento (${clp(montoSaldo)}).`
  const html = `<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nueva cotización RUTABAR</title></head>
  <body style="margin:0;padding:0;background-color:#fdf2f1;font-family:Arial,Helvetica,sans-serif;color:#131311">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#fdf2f1">
      <tr><td align="center" style="padding:32px 14px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background-color:#fffbfa;border:1px solid #f0dadd;border-radius:18px;overflow:hidden">
          <tr><td style="padding:28px 32px;background-color:#6d0002">
            <p style="margin:0 0 20px;color:#ffc2c8;font-size:13px;font-weight:700;letter-spacing:3px">RUTABAR</p>
            <p style="margin:0 0 8px;color:#ffe3e4;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Nueva solicitud de cotización</p>
            <h1 style="margin:0;color:#ffffff;font-size:27px;line-height:1.2;font-weight:700">${escaparHtml(carta.nombre)}</h1>
            <p style="margin:8px 0 0;color:#ffe3e4;font-size:15px">${datos.duracion} horas · ${escaparHtml(fechaVisible)}</p>
          </td></tr>
          <tr><td style="padding:28px 32px 12px">
            <p style="margin:0 0 18px;color:#262622;font-size:15px;line-height:1.65">Hola equipo, <strong>${escaparHtml(datos.nombre)}</strong> envió una solicitud para su evento. El servicio solicitado es <strong>barra libre</strong> durante las horas contratadas.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 22px;border:1px solid #f0dadd;border-radius:12px;background-color:#fff5f4">
              <tr><td style="padding:17px 20px">
                <p style="margin:0 0 5px;color:#6b5254;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Total final con IVA incluido</p>
                <p style="margin:0;color:#8a0019;font-size:30px;line-height:1.2;font-weight:700">${escaparHtml(clp(total))}</p>
                <p style="margin:7px 0 0;color:#6b5254;font-size:13px">${escaparHtml(clp(porPersona))} por persona · ${datos.asistentes} asistentes</p>
              </td></tr>
            </table>
            <h2 style="margin:0 0 10px;color:#131311;font-size:16px">Datos del evento y la cotización</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse">${detalleHtml}</table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:22px;background-color:#fff5f4;border-left:4px solid #c60015">
              <tr><td style="padding:14px 16px;color:#4b3336;font-size:13px;line-height:1.65"><strong>Condiciones de pago</strong><br>${PAGO.reservaPct}% para reservar: ${escaparHtml(clp(montoReserva))}<br>${PAGO.saldoPct}% el día del evento: ${escaparHtml(clp(montoSaldo))}<br>Ambos pagos suman el total de ${escaparHtml(clp(total))}.</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:20px 32px 26px;border-top:1px solid #f0dadd">
            <p style="margin:0;color:#706f6a;font-size:12px;line-height:1.6">Este correo fue generado desde el cotizador de <strong style="color:#6d0002">RUTABAR</strong>. Responde directamente para contactar a la persona interesada.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

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
        subject: `Nueva cotización · ${carta.nombre} · ${fechaVisible}`.replace(/[\r\n]+/g, ' ').slice(0, 180),
        text: detalleTextoPlano,
        html,
      }),
      signal: AbortSignal.timeout(12_000),
    })

    if (!resend.ok) {
      return Response.json({ error: 'El correo no se pudo enviar en este momento. Inténtalo otra vez o escríbenos a contacto@barrabar.cl.' }, { status: 502 })
    }

    return Response.json({ enviado: true }, { status: 200 })
  } catch {
    return Response.json({ error: 'El correo no se pudo enviar en este momento. Inténtalo otra vez o escríbenos a contacto@barrabar.cl.' }, { status: 502 })
  }
}
