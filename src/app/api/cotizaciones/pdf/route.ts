import { CONFIG_COTIZACION, asistentesEnRango, type CartaCotizacionId, type DuracionCotizacion } from '@/data/precios-cotizacion'
import { generarCotizacionPdf } from '@/lib/cotizacion-pdf'

export const runtime = 'nodejs'

type ItemCarta = { nombre: string; detalle: string; icono: '24' }

function texto(valor: unknown, maximo: number, opcional = false): valor is string {
  return typeof valor === 'string' && valor.trim().length <= maximo && (opcional || valor.trim().length > 0)
}

function monto(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isSafeInteger(valor) && valor >= 0 && valor <= 1_000_000_000
}

function validarItems(valor: unknown): valor is ItemCarta[] {
  return Array.isArray(valor) && valor.length > 0 && valor.length <= 16 && valor.every((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false
    const entrada = item as Record<string, unknown>
    return texto(entrada.nombre, 60) && texto(entrada.detalle, 180, true) && entrada.icono === '24'
  })
}

export async function POST(request: Request) {
  const largo = Number(request.headers.get('content-length') || 0)
  if (largo > 12_000) return Response.json({ error: 'La cotización supera el tamaño permitido.' }, { status: 413 })

  let entrada: Record<string, unknown>
  try {
    const valor = await request.json()
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error('invalid payload')
    entrada = valor as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Datos inválidos para generar la cotización.' }, { status: 400 })
  }

  const personalizada = entrada.cartaId === 'personalizada'
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === entrada.cartaId)
  const duracion = CONFIG_COTIZACION.duraciones.find((opcion) => opcion === entrada.duracion)
  const fecha = entrada.fecha
  const fechaValida = fecha === '' || (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha))
  const telefono = typeof entrada.whatsapp === 'string' ? entrada.whatsapp.trim() : ''
  const digitosTelefono = telefono.replace(/\D/g, '')
  const telefonoValido = !telefono || (telefono.length <= 32 && digitosTelefono.length >= 8 && digitosTelefono.length <= 15)

  if (
    (!carta && !personalizada) || !duracion ||
    !texto(entrada.nombre, 100) || !texto(entrada.ciudad, 100, true) ||
    !texto(entrada.lugar, 160, true) || !fechaValida || !telefonoValido ||
    !asistentesEnRango(Number(entrada.asistentes)) || typeof entrada.asistentes !== 'number' ||
    !monto(entrada.total) || entrada.total === 0 || !monto(entrada.totalNeto) ||
    !monto(entrada.porPersona) || !monto(entrada.montoReserva) || !monto(entrada.montoSaldo) ||
    typeof entrada.solicitaCartaDigital !== 'boolean' ||
    (personalizada && (!texto(entrada.cartaNombre, 60) || !validarItems(entrada.items)))
  ) return Response.json({ error: 'Revisa los datos de la cotización e inténtalo otra vez.' }, { status: 400 })
  if (!personalizada && entrada.totalNeto !== Math.round(Number(entrada.total) / 1.19)) {
    return Response.json({ error: 'El neto de la cotización no coincide con la tarifa web más IVA.' }, { status: 400 })
  }

  try {
    const pdf = await generarCotizacionPdf({
      nombre: entrada.nombre.trim(),
      fecha,
      ciudad: entrada.ciudad.trim() || 'Por confirmar',
      lugar: entrada.lugar.trim() || 'Por confirmar',
      asistentes: Number(entrada.asistentes),
      ...(telefono ? { whatsapp: telefono } : {}),
      cartaId: personalizada ? 'personalizada' : carta!.id as CartaCotizacionId,
      ...(personalizada ? { cartaNombre: String(entrada.cartaNombre).trim(), items: entrada.items as ItemCarta[] } : {}),
      duracion: duracion as DuracionCotizacion,
      total: entrada.total,
      totalNeto: entrada.totalNeto,
      porPersona: entrada.porPersona,
      montoReserva: entrada.montoReserva,
      montoSaldo: entrada.montoSaldo,
      solicitaCartaDigital: entrada.solicitaCartaDigital,
    })
    return new Response(Buffer.from(pdf), {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="Cotizacion-y-carta-RUTABAR.pdf"',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('No se pudo generar la cotización descargable', { tipo: error instanceof Error ? error.name : 'unknown' })
    return Response.json({ error: 'No pudimos preparar el PDF de la cotización. Inténtalo otra vez.' }, { status: 500 })
  }
}
