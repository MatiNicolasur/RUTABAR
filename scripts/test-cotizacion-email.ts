import assert from 'node:assert/strict'
import { PDFDocument } from 'pdf-lib'
import { POST } from '../src/app/api/cotizaciones/route'
import { generarCotizacionPdf } from '../src/lib/cotizacion-pdf'
import { calcularPrecioCotizacion, type CartaCotizacionId } from '../src/data/precios-cotizacion'

async function main() {
  process.env.RESEND_API_KEY = 'clave-simulada'
  process.env.RESEND_FROM_EMAIL = 'RUTABAR <contacto@rutabar.cl>'
  process.env.RESEND_TO_EMAIL = 'contacto@rutabar.cl'

  let envio: Record<string, unknown> | undefined
  let llamadas = 0
  const fetchOriginal = globalThis.fetch
  globalThis.fetch = (async (_url: RequestInfo | URL, opciones?: RequestInit) => {
    llamadas++
    envio = JSON.parse(String(opciones?.body)) as Record<string, unknown>
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
    assert.doesNotMatch(String(envio?.text), /\$|50%|Condiciones del servicio/)

    const adjuntos = envio?.attachments as { filename: string; content: string }[]
    assert.equal(adjuntos.length, 2)
    assert.equal(adjuntos[0].filename, 'Cotizacion-y-carta-RUTABAR.pdf')
    assert.equal(adjuntos[1].filename, 'logo-rutabar.png')
    const pdf = Buffer.from(adjuntos[0].content, 'base64')
    assert.equal(pdf.subarray(0, 4).toString(), '%PDF')
    assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1)
    assert.equal(pdf.includes(Buffer.from('/DCTDecode')), false, 'El PDF no debe incluir fotos JPEG')
    assert.equal(llamadas, 1)
    for (const cartaId of ['reducida', 'sin-alcohol'] as CartaCotizacionId[]) {
      const total = calcularPrecioCotizacion(cartaId, 4, 40)
      const archivo = await generarCotizacionPdf({
        nombre: 'Cliente de prueba', fecha: '2026-11-14', ciudad: 'Santiago', lugar: 'Patio de eventos',
        asistentes: 40, cartaId, duracion: 4, total, porPersona: Math.round(total / 40),
        montoReserva: total / 2, montoSaldo: total / 2, solicitaCartaDigital: false,
      })
      assert.equal((await PDFDocument.load(archivo)).getPageCount(), 1)
    }
    process.stdout.write('Envío simulado correcto: correo breve, logo incrustado y cotización en PDF.\n')
  } finally {
    globalThis.fetch = fetchOriginal
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Falló la prueba'}\n`)
  process.exitCode = 1
})
