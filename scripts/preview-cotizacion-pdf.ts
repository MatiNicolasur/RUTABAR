import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { generarCotizacionPdf } from '../src/lib/cotizacion-pdf'
import { calcularPrecioCotizacion } from '../src/data/precios-cotizacion'

async function main() {
  const cartaId = 'completa'
  const duracion = 4
  const asistentes = 40
  const total = calcularPrecioCotizacion(cartaId, duracion, asistentes)
  const montoReserva = Math.round(total / 2)
  const pdf = await generarCotizacionPdf({
    nombre: 'Cliente de prueba',
    fecha: '2026-11-14',
    ciudad: 'Santiago',
    lugar: 'Patio de eventos',
    asistentes,
    whatsapp: '+56 9 1234 5678',
    cartaId,
    duracion,
    total,
    porPersona: Math.round(total / asistentes),
    montoReserva,
    montoSaldo: total - montoReserva,
    solicitaCartaDigital: true,
  })

  const carpeta = path.join(process.cwd(), 'output', 'pdf')
  await mkdir(carpeta, { recursive: true })
  const archivo = path.join(carpeta, 'cotizacion-rutabar-ejemplo.pdf')
  await writeFile(archivo, pdf)
  process.stdout.write(`${archivo}\n`)
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'No se pudo generar el PDF'}\n`)
  process.exitCode = 1
})
