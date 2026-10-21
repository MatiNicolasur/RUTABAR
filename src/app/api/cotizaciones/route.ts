import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { CONFIG_COTIZACION, asistentesEnRango, calcularPrecioCotizacion, type CartaCotizacionId, type DuracionCotizacion, type ModoCotizacion } from '@/data/precios-cotizacion'
import { PAGO } from '@/data/pago'
import { generarCotizacionPdf } from '@/lib/cotizacion-pdf'
import { SITIO } from '@/lib/seo'

export const runtime = 'nodejs'

type DatosCotizacion = {
  nombre: string
  correo: string
  whatsapp: string
  fecha: string
  ciudad: string
  lugar: string
  asistentes: number
  cartaId: CartaCotizacionId | 'personalizada'
  detalleCarta: string
  duracion: DuracionCotizacion
  modo: ModoCotizacion
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
  const personalizada = entrada.cartaId === 'personalizada'
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === entrada.cartaId)
  const detalleCarta = typeof entrada.detalleCarta === 'string' ? entrada.detalleCarta.trim() : ''
  const duracion = CONFIG_COTIZACION.duraciones.find((opcion) => opcion === entrada.duracion)
  const modo = entrada.modo === undefined ? 'flexible'
    : entrada.modo === 'pack' || entrada.modo === 'flexible' ? entrada.modo : null
  const correo = typeof entrada.correo === 'string' ? entrada.correo.trim() : ''
  const whatsapp = typeof entrada.whatsapp === 'string' ? entrada.whatsapp.trim() : ''
  const fechaValida = typeof entrada.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entrada.fecha)
  const correoValido = correo.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
  const digitosWhatsapp = whatsapp.replace(/\D/g, '')
  const whatsappValido = !whatsapp || (whatsapp.length <= 32 && digitosWhatsapp.length >= 8 && digitosWhatsapp.length <= 15)

  if (
    (!carta && !personalizada) || !duracion || !modo ||
    (modo === 'pack' && (personalizada || duracion !== CONFIG_COTIZACION.packs.duracion)) ||
    (personalizada && (detalleCarta.length < 10 || detalleCarta.length > 1000)) ||
    !esTexto(entrada.nombre, 100) ||
    !correoValido || !whatsappValido ||
    !fechaValida ||
    !esTexto(entrada.ciudad, 100) ||
    (entrada.lugar !== undefined && (typeof entrada.lugar !== 'string' || entrada.lugar.length > 160)) ||
    !asistentesEnRango(Number(entrada.asistentes)) || typeof entrada.asistentes !== 'number' ||
    typeof entrada.solicitaCartaDigital !== 'boolean'
  ) return null

  return {
    nombre: entrada.nombre.trim(),
    correo,
    whatsapp,
    fecha: String(entrada.fecha),
    ciudad: entrada.ciudad.trim(),
    lugar: typeof entrada.lugar === 'string' ? entrada.lugar.trim() : '',
    asistentes: Number(entrada.asistentes),
    cartaId: personalizada ? 'personalizada' : carta!.id,
    detalleCarta,
    duracion,
    modo,
    solicitaCartaDigital: entrada.solicitaCartaDigital,
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const remitente = process.env.RESEND_FROM_EMAIL || 'RUTABAR <contacto@rutabar.cl>'
  const destinatario = process.env.RESEND_TO_EMAIL || 'contacto@rutabar.cl'

  if (!apiKey) {
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

  const fechaVisible = datos.fecha.split('-').reverse().join('/')
  const disponibilidad = `La fecha que nos indicaste (${fechaVisible}) es tentativa y está sujeta a disponibilidad. Nuestro equipo revisará la agenda y te contactará pronto para confirmarla.`
  const preguntas = [
    '¿En qué lugar y dirección será el evento, y a qué hora te gustaría que comience el servicio de barra?',
    '¿Qué tipo de celebración estás preparando y qué detalles o necesidades especiales te gustaría que tengamos en cuenta?',
  ]
  const contactoCoordinacion = 'Déjanos también el nombre y teléfono de la persona con quien coordinaremos el evento.'
  const recordatorioAbono = `Recuerda que para reservar tu fecha tienes que abonar el ${PAGO.reservaPct}% del servicio.`
  const reserva = `Una vez que confirmemos la disponibilidad y acordemos la propuesta contigo, te enviaremos los datos de transferencia para abonar el ${PAGO.reservaPct}%. Podrás responder a este mismo correo con el comprobante de pago; al validar el abono, te confirmaremos la reserva de la fecha por escrito.`
  const saldo = `El ${PAGO.saldoPct}% restante se paga el día del evento.`
  const telefonoWhatsApp = SITIO.telefono.replace(/\D/g, '')
  const telefonoVisible = telefonoWhatsApp.length === 11 && telefonoWhatsApp.startsWith('56')
    ? `+56 9 ${telefonoWhatsApp.slice(3, 7)} ${telefonoWhatsApp.slice(7)}`
    : `+${telefonoWhatsApp}`
  const enlaceWhatsApp = `https://wa.me/${telefonoWhatsApp}`
  const enlaceTelefono = `tel:+${telefonoWhatsApp}`
  const contactoTexto = `Si te parece bien, puedes contactarme por WhatsApp o llamarme al ${telefonoVisible}. También puedes responder a este correo. Si quieres ajustar algo o tienes alguna pregunta, no dudes en contactarme.`
  const contactoHtml = `<p style="margin:0 0 28px;color:#4b4141;font-size:15px;line-height:1.7">Si te parece bien, puedes escribirme por <a href="${enlaceWhatsApp}" style="color:#6d0002;font-weight:700">WhatsApp</a> o llamarme al <a href="${enlaceTelefono}" style="color:#6d0002;font-weight:700">${telefonoVisible}</a>. También puedes responder a este correo. Si quieres ajustar algo o tienes alguna pregunta, no dudes en contactarme.</p>`
  const seguimientoTexto = [
    disponibilidad,
    `Para avanzar, cuéntanos respondiendo a este correo:\n${preguntas.map((pregunta, indice) => `${indice + 1}. ${pregunta}`).join('\n')}`,
    contactoCoordinacion,
    recordatorioAbono,
    reserva,
    saldo,
  ].join('\n\n')
  const seguimientoHtml = `
    <p style="margin:0 0 18px;color:#4b4141;font-size:15px;line-height:1.7">${escaparHtml(disponibilidad)}</p>
    <p style="margin:0 0 12px;color:#4b4141;font-size:15px;line-height:1.7">Para avanzar, cuéntanos respondiendo a este correo:</p>
    <ol style="margin:0 0 18px;padding-left:22px;color:#4b4141;font-size:15px;line-height:1.7">${preguntas.map((pregunta) => `<li style="margin-bottom:12px">${escaparHtml(pregunta)}</li>`).join('')}</ol>
    <p style="margin:0 0 22px;color:#4b4141;font-size:15px;line-height:1.7">${escaparHtml(contactoCoordinacion)}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;background:#fdf2f1;border-left:3px solid #c60015"><tr><td style="padding:16px 18px;color:#4b4141;font-size:15px;line-height:1.7"><strong style="color:#6d0002">${escaparHtml(recordatorioAbono)}</strong><br>${escaparHtml(reserva)}</td></tr></table>
    <p style="margin:0 0 24px;color:#6d0002;font-size:15px;line-height:1.7"><strong>${escaparHtml(saldo)}</strong></p>`

  if (datos.cartaId === 'personalizada') {
    const contactoPersonalizado = datos.whatsapp ? `\nWhatsApp: ${datos.whatsapp}` : ''
    const beneficioPersonalizado = datos.solicitaCartaDigital ? '\nCarta digital con branding: solicitada.' : ''
    const detalleTexto = `Hola, ${datos.nombre}:\n\nRecibimos tu solicitud de carta personalizada para ${datos.asistentes} invitados el ${datos.fecha} en ${datos.lugar}, ${datos.ciudad}, durante ${datos.duracion} horas.${contactoPersonalizado}\n\nTragos e ideas: ${datos.detalleCarta}${beneficioPersonalizado}\n\nRevisaremos la selección y te responderemos con una propuesta y su precio. Esta solicitud no es una cotización automática.\n\n${seguimientoTexto}\n\n${contactoTexto}\n\nUn abrazo,\nMatías Urquiza\nRUTABAR`
    const htmlPersonalizado = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Recibimos tu solicitud RUTABAR</title></head><body style="margin:0;padding:24px;background:#fdf2f1;font-family:Arial,Helvetica,sans-serif;color:#251c1c"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:auto;background:#fff"><tr><td style="padding:28px 34px;background:#6d0002;color:#fff"><strong style="font-size:24px;letter-spacing:2px">RUTABAR</strong><h1 style="margin:18px 0 0;font-size:23px">Recibimos tu idea</h1></td></tr><tr><td style="padding:30px 34px;line-height:1.65"><p>Hola, <strong>${escaparHtml(datos.nombre)}</strong>. Gracias por pensar en RUTABAR para tu evento.</p><p>Recibimos tu solicitud de carta personalizada para <strong>${datos.asistentes} invitados</strong>, el <strong>${escaparHtml(datos.fecha)}</strong>, en <strong>${escaparHtml(datos.lugar)}, ${escaparHtml(datos.ciudad)}</strong>, durante <strong>${datos.duracion} horas</strong>.</p>${datos.whatsapp ? `<p>WhatsApp: ${escaparHtml(datos.whatsapp)}</p>` : ''}<p style="padding:16px;background:#fdf2f1;border-left:3px solid #c60015;white-space:pre-wrap">${escaparHtml(datos.detalleCarta)}</p>${datos.solicitaCartaDigital ? '<p>Carta digital con branding: solicitada.</p>' : ''}<p>Revisaremos la selección y te responderemos con una propuesta y su precio. Esta solicitud aún no es una cotización.</p>${seguimientoHtml}${contactoHtml}<p>Un abrazo,<br><strong>Matías Urquiza</strong><br>RUTABAR</p></td></tr></table></body></html>`
    try {
      const resend = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: remitente,
          to: [datos.correo],
          ...(datos.correo.toLowerCase() !== destinatario.toLowerCase() ? { bcc: [destinatario] } : {}),
          reply_to: destinatario,
          subject: 'Recibimos tu solicitud de carta personalizada · RUTABAR',
          text: detalleTexto,
          html: htmlPersonalizado,
        }),
        signal: AbortSignal.timeout(20_000),
      })
      if (!resend.ok) {
        console.error('Resend rechazó una solicitud personalizada', { status: resend.status })
        return Response.json({ error: 'El correo no se pudo enviar en este momento. Inténtalo otra vez.' }, { status: 502 })
      }
      return Response.json({ enviado: true }, { status: 200 })
    } catch (error) {
      console.error('No se pudo conectar con Resend', { tipo: error instanceof Error ? error.name : 'unknown' })
      return Response.json({ error: 'No se pudo conectar con el servicio de correo. Inténtalo otra vez.' }, { status: 502 })
    }
  }

  const total = calcularPrecioCotizacion(datos.cartaId, datos.duracion, datos.asistentes, datos.modo)
  const porPersona = Math.round(total / datos.asistentes)
  const montoReserva = Math.round((total * PAGO.reservaPct) / 100)
  const montoSaldo = total - montoReserva
  const detalleTextoPlano = `Hola, ${datos.nombre}:\n\nGracias por pensar en RUTABAR para tu evento. Te adjunto la cotización y la carta de tragos en un PDF para que revises todos los detalles.\n\n${seguimientoTexto}\n\n${contactoTexto}\n\nUn abrazo,\nMatías Urquiza\nRUTABAR`
  const html = `<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tu cotización RUTABAR</title></head>
  <body style="margin:0;padding:0;background-color:#f7f3f1;font-family:Arial,Helvetica,sans-serif;color:#251c1c">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f7f3f1">
      <tr><td align="center" style="padding:32px 16px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background-color:#ffffff">
          <tr><td align="center" style="padding:32px 24px;background-color:#6d0002">
            <img src="cid:rutabar-logo" width="104" height="101" alt="RUTABAR" style="display:block;width:104px;height:auto;border:0;color:#ffffff;font-size:16px;font-weight:700">
          </td></tr>
          <tr><td style="padding:38px 36px 34px">
            <p style="margin:0 0 22px;color:#6d0002;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase">Tu cotización está lista</p>
            <h1 style="margin:0 0 24px;color:#251c1c;font-size:25px;line-height:1.25;font-weight:700">Hola, ${escaparHtml(datos.nombre)}.</h1>
            <p style="margin:0 0 18px;color:#4b4141;font-size:15px;line-height:1.7">Gracias por pensar en RUTABAR para tu evento. Te adjunto la cotización y la carta de tragos en un PDF para que revises todos los detalles.</p>
            ${seguimientoHtml}
            ${contactoHtml}
            <p style="margin:0;color:#251c1c;font-size:15px;line-height:1.6">Un abrazo,<br><strong>Matías Urquiza</strong><br>RUTABAR</p>
          </td></tr>
          <tr><td style="padding:18px 36px 22px;border-top:1px solid #eee6e3">
            <p style="margin:0;color:#817676;font-size:12px;line-height:1.5">Cotización y carta de tragos · PDF adjunto</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

  let pdf: Uint8Array
  let logo: Buffer
  try {
    const archivos = await Promise.all([
      generarCotizacionPdf({
        nombre: datos.nombre, fecha: datos.fecha, ciudad: datos.ciudad, lugar: datos.lugar,
        asistentes: datos.asistentes, whatsapp: datos.whatsapp || undefined, cartaId: datos.cartaId, duracion: datos.duracion,
        total, porPersona, montoReserva, montoSaldo, solicitaCartaDigital: datos.solicitaCartaDigital,
      }),
      readFile(path.join(process.cwd(), 'public', 'carta-pdf', 'logo-blanco.png')),
    ])
    pdf = archivos[0]
    logo = archivos[1]
  } catch (error) {
    console.error('No se pudo generar la cotización PDF', { tipo: error instanceof Error ? error.name : 'unknown' })
    return Response.json({ error: 'No pudimos preparar el PDF de la cotización. Inténtalo otra vez.' }, { status: 500 })
  }

  try {
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: remitente,
        to: [datos.correo],
        ...(datos.correo.toLowerCase() !== destinatario.toLowerCase() ? { bcc: [destinatario] } : {}),
        reply_to: destinatario,
        subject: 'Tu cotización RUTABAR está lista',
        text: detalleTextoPlano,
        html,
        attachments: [
          { filename: 'Cotizacion-y-carta-RUTABAR.pdf', content: Buffer.from(pdf).toString('base64') },
          { filename: 'logo-rutabar.png', content: logo.toString('base64'), content_type: 'image/png', content_id: 'rutabar-logo' },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    })

    if (!resend.ok) {
      // Registrar solo el estado y el código del proveedor: la respuesta puede
      // contener direcciones u otros datos que no deben aparecer en los logs.
      const respuesta: unknown = await resend.json().catch(() => null)
      const codigo = respuesta && typeof respuesta === 'object' && 'name' in respuesta && typeof respuesta.name === 'string'
        ? respuesta.name
        : 'unknown'
      console.error('Resend rechazó una cotización', { status: resend.status, codigo })

      return Response.json({ error: 'El correo no se pudo enviar en este momento. Inténtalo otra vez.' }, { status: 502 })
    }

    return Response.json({ enviado: true }, { status: 200 })
  } catch (error) {
    console.error('No se pudo conectar con Resend', { tipo: error instanceof Error ? error.name : 'unknown' })
    return Response.json({ error: 'No se pudo conectar con el servicio de correo. Inténtalo otra vez.' }, { status: 502 })
  }
}
