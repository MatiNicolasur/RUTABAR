import assert from 'node:assert/strict'
import { PDFArray, PDFDocument, PDFRawStream, decodePDFRawStream } from 'pdf-lib'
import { POST } from '../src/app/api/cotizaciones/route'
import { generarCotizacionPdf } from '../src/lib/cotizacion-pdf'
import { calcularPrecioCotizacion, CONFIG_COTIZACION, type CartaCotizacionId } from '../src/data/precios-cotizacion'

async function main() {
  for (const carta of CONFIG_COTIZACION.cartas) {
    for (const horas of CONFIG_COTIZACION.duraciones) {
      assert.equal(calcularPrecioCotizacion(carta.id, horas, 40), carta.precios[horas])
    }
  }
  assert.equal(calcularPrecioCotizacion('reducida', 5, 80), 1_096_000)
  for (const [cartaId, porPersona] of [
    ['reducida', 13_200], ['completa', 16_200], ['sin-alcohol', 11_200],
  ] as const) {
    for (const asistentes of [20, 40, 300]) {
      assert.equal(calcularPrecioCotizacion(cartaId, 5, asistentes, 'pack'), porPersona * asistentes)
    }
    assert.equal(calcularPrecioCotizacion(cartaId, 4, 20, 'pack'), 0)
    assert.equal(calcularPrecioCotizacion(cartaId, 5, 19, 'pack'), 0)
  }
  process.env.RESEND_API_KEY = 'clave-simulada'
  process.env.RESEND_FROM_EMAIL = 'RUTABAR <contacto@rutabar.cl>'
  process.env.RESEND_TO_EMAIL = 'contacto@rutabar.cl'

  let envio: Record<string, unknown> | undefined
  const envios: Record<string, unknown>[] = []
  let llamadas = 0
  const fetchOriginal = globalThis.fetch
  globalThis.fetch = (async (_url: RequestInfo | URL, opciones?: RequestInit) => {
    llamadas++
    envio = JSON.parse(String(opciones?.body)) as Record<string, unknown>
    envios.push(envio)
    return new Response(JSON.stringify({ id: 'correo-simulado' }), { status: 200 })
  }) as typeof fetch

  try {
    const datos = {
      nombre: 'Cliente de prueba', correo: 'cliente@example.com', whatsapp: '',
      fecha: '2026-11-14', ciudad: 'Santiago', lugar: 'Patio de eventos',
      asistentes: 40, cartaId: 'completa', duracion: 4, solicitaCartaDigital: true,
    }
    const sinCorreo = await POST(new Request('http://localhost/api/cotizaciones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, correo: '' }),
    }))
    assert.equal(sinCorreo.status, 400)
    assert.equal(llamadas, 0)

    const solicitud = new Request('http://localhost/api/cotizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    const respuesta = await POST(solicitud)
    assert.equal(respuesta.status, 200)
    assert.deepEqual(envio?.to, ['cliente@example.com'])
    assert.deepEqual(envio?.bcc, ['contacto@rutabar.cl'])
    assert.match(String(envio?.html), /Matías Urquiza/)
    assert.match(String(envio?.html), /src="cid:rutabar-logo"/)
    assert.doesNotMatch(String(envio?.html), /Condiciones de pago|Total final|Precio por persona/)
    assert.doesNotMatch(String(envio?.text), /\$|Condiciones del servicio/)
    assert.deepEqual(envio?.reply_to, 'contacto@rutabar.cl')
    for (const formato of ['text', 'html']) {
      const contenido: string = String(envio?.[formato])
      assert.match(contenido, /14\/11\/2026/)
      assert.match(contenido, /tentativa y está sujeta a disponibilidad/)
      assert.match(contenido, /revisará la agenda/)
      assert.match(contenido, /datos de transferencia para abonar el 50%/)
      assert.match(contenido, /comprobante de pago/)
      assert.match(contenido, /al validar el abono, te confirmaremos la reserva/)
      assert.match(contenido, /50% restante se paga el día del evento/)
      assert.equal((contenido.match(/¿/g) ?? []).length, 2)
    }

    const adjuntos = envio?.attachments as { filename: string; content: string }[]
    assert.equal(adjuntos.length, 2)
    assert.equal(adjuntos[0].filename, 'Cotizacion-y-carta-RUTABAR.pdf')
    assert.equal(adjuntos[1].filename, 'logo-rutabar.png')
    const pdf = Buffer.from(adjuntos[0].content, 'base64')
    assert.equal(pdf.subarray(0, 4).toString(), '%PDF')
    assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1)
    assert.equal(pdf.includes(Buffer.from('/DCTDecode')), false, 'El PDF no debe incluir fotos JPEG')
    assert.equal(llamadas, 1)
    const sinLugar = await POST(new Request('http://localhost/api/cotizaciones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, lugar: '' }),
    }))
    assert.equal(sinLugar.status, 200)
    assert.equal(llamadas, 2)
    for (const cartaId of ['reducida', 'sin-alcohol'] as CartaCotizacionId[]) {
      const total = calcularPrecioCotizacion(cartaId, 4, 40)
      const archivo = await generarCotizacionPdf({
        nombre: 'Cliente de prueba', fecha: '2026-11-14', ciudad: 'Santiago', lugar: 'Patio de eventos',
        asistentes: 40, cartaId, duracion: 4, total, porPersona: Math.round(total / 40),
        montoReserva: total / 2, montoSaldo: total / 2, solicitaCartaDigital: false,
      })
      assert.equal((await PDFDocument.load(archivo)).getPageCount(), 1)
    }
    const personalizada = await POST(new Request('http://localhost/api/cotizaciones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, cartaId: 'personalizada', detalleCarta: 'Mojito, gin tonic y dos mocktails cítricos' }),
    }))
    assert.equal(personalizada.status, 200)
    assert.equal(llamadas, 3)
    assert.match(String(envio?.subject), /carta personalizada/i)
    assert.match(String(envio?.text), /Mojito, gin tonic/)
    assert.match(String(envio?.text), /tentativa y está sujeta a disponibilidad/)
    assert.match(String(envio?.html), /50% restante se paga el día del evento/)
    assert.equal(envio?.attachments, undefined, 'La solicitud personalizada no debe enviar un precio ni un PDF de carta fija')
    const personalizadaIncompleta = await POST(new Request('http://localhost/api/cotizaciones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, cartaId: 'personalizada', detalleCarta: '' }),
    }))
    assert.equal(personalizadaIncompleta.status, 400)
    assert.equal(llamadas, 3)
    const packDuracionInvalida = await POST(new Request('http://localhost/api/cotizaciones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, modo: 'pack' }),
    }))
    assert.equal(packDuracionInvalida.status, 400)
    assert.equal(llamadas, 3)
    const pack = await POST(new Request('http://localhost/api/cotizaciones', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, whatsapp: '+56 9 1111 2222', modo: 'pack', duracion: 5, asistentes: 20 }),
    }))
    assert.equal(pack.status, 200)
    assert.equal(llamadas, 4)
    const adjuntosPack = envios.at(-1)?.attachments as { content: string }[]
    const pdfPack = Buffer.from(adjuntosPack[0].content, 'base64')
    const documentoPack = await PDFDocument.load(pdfPack)
    assert.equal(documentoPack.getPageCount(), 1)
    const contenidos = documentoPack.getPages()[0].node.Contents()
    assert(contenidos instanceof PDFArray)
    const operaciones = contenidos.asArray().map((referencia) => {
      const stream = documentoPack.context.lookup(referencia)
      assert(stream instanceof PDFRawStream)
      return Buffer.from(decodePDFRawStream(stream).decode()).toString('latin1')
    }).join('\n')
    for (const monto of ['$272.269 + IVA', '$324.000', '$162.000', '+56 9 1111 2222']) {
      assert(operaciones.includes(Buffer.from(monto).toString('hex').toUpperCase()), `Falta ${monto} en el PDF del pack`)
    }
    process.stdout.write('Envío simulado correcto: correo, PDF con neto + IVA, pago 50/50 y WhatsApp del cliente.\n')
  } finally {
    globalThis.fetch = fetchOriginal
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Falló la prueba'}\n`)
  process.exitCode = 1
})
