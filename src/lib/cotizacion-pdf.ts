import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib'
import { CARTA_WEB, MOCKTAILS_WEB, type TragoWeb } from '../data/carta-web'
import { CONDICIONES, type BloqueCondiciones } from '../data/condiciones'
import { CONFIG_COTIZACION, type CartaCotizacionId, type DuracionCotizacion } from '../data/precios-cotizacion'
import { clp } from './formato'

export type CotizacionPdfDatos = {
  nombre: string
  fecha: string
  ciudad: string
  lugar: string
  asistentes: number
  whatsapp?: string
  cartaId: CartaCotizacionId
  duracion: DuracionCotizacion
  total: number
  porPersona: number
  montoReserva: number
  montoSaldo: number
  solicitaCartaDigital: boolean
}

const ANCHO = 595.28
const ALTO = 841.89
const MARGEN = 38
const ROJO = rgb(0.52, 0, 0.09)
const ROJO_CLARO = rgb(0.97, 0.88, 0.88)
const TINTA = rgb(0.10, 0.10, 0.10)
const SUAVE = rgb(0.37, 0.32, 0.32)
const BLANCO = rgb(1, 1, 1)

function seguro(texto: string): string {
  return texto.normalize('NFC').replace(/[\u2013\u2014]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[^\u0020-\u00ff]/g, '')
}

function linea(page: PDFPage, texto: string, x: number, y: number, font: PDFFont, size: number, color = TINTA) {
  page.drawText(seguro(texto), { x, y, font, size, color })
}

function ajustar(texto: string, font: PDFFont, size: number, ancho: number): number {
  return Math.min(size, size * ancho / Math.max(1, font.widthOfTextAtSize(seguro(texto), size)))
}

function lineas(texto: string, font: PDFFont, size: number, ancho: number): string[] {
  const palabras = seguro(texto).split(/\s+/)
  const resultado: string[] = []
  let actual = ''
  for (const palabra of palabras) {
    const prueba = actual ? `${actual} ${palabra}` : palabra
    if (actual && font.widthOfTextAtSize(prueba, size) > ancho) {
      resultado.push(actual)
      actual = palabra
    } else {
      actual = prueba
    }
  }
  if (actual) resultado.push(actual)
  return resultado
}

function parrafo(page: PDFPage, texto: string, x: number, y: number, ancho: number, font: PDFFont, size: number, color = TINTA, interlineado = size * 1.35) {
  for (const fragmento of lineas(texto, font, size, ancho)) {
    linea(page, fragmento, x, y, font, size, color)
    y -= interlineado
  }
  return y
}

function valor(page: PDFPage, etiqueta: string, texto: string, x: number, y: number, ancho: number, negrita: PDFFont) {
  linea(page, etiqueta.toUpperCase(), x, y, negrita, 7.2, ROJO)
  linea(page, texto, x, y - 15, negrita, ajustar(texto, negrita, 10, ancho))
}

function tragosDeCarta(cartaId: CartaCotizacionId): TragoWeb[] {
  if (cartaId === 'sin-alcohol') return CARTA_WEB.filter((trago) => trago.familia === 'sin-alcohol')
  if (cartaId === 'reducida') {
    return CARTA_WEB.filter((trago) => ['mojito', 'gin-tonic', 'pisco-sour', 'gin-tropical'].includes(trago.id))
  }
  return CARTA_WEB
}

function bebidasDeCarta(cartaId: CartaCotizacionId): string {
  if (cartaId === 'sin-alcohol') return 'Coca-Cola, jugo, Sprite, otra bebida sin alcohol a elección y agua.'
  if (cartaId === 'reducida') return 'Cerveza, vino tinto, vino blanco y agua.'
  return 'Cerveza, vinos, Coca-Cola, jugo, Sprite, otra bebida sin alcohol a elección y agua.'
}

function bloqueCondiciones(page: PDFPage, bloque: BloqueCondiciones, x: number, y: number, ancho: number, normal: PDFFont, negrita: PDFFont) {
  linea(page, bloque.titulo.toUpperCase(), x, y, negrita, 8.7, ROJO)
  y -= 13
  for (const punto of bloque.puntos) {
    y = parrafo(page, `- ${punto}`, x, y, ancho, normal, 7.4, TINTA, 9.2) - 3.5
  }
  return y - 7
}

export async function generarCotizacionPdf(datos: CotizacionPdfDatos): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  const normal = await pdf.embedFont(StandardFonts.Helvetica)
  const negrita = await pdf.embedFont(StandardFonts.HelveticaBold)
  const mairo = await pdf.embedFont(await readFile(path.join(process.cwd(), 'public', 'carta-pdf', 'Mairo.ttf')))
  const logo = await pdf.embedPng(await readFile(path.join(process.cwd(), 'public', 'carta-pdf', 'logo-blanco.png')))
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === datos.cartaId)!
  const tragos = tragosDeCarta(datos.cartaId)
  // Las tarifas configuradas ya incluyen IVA; se reconstruye la base neta para mostrarla junto a "+ IVA".
  const totalNeto = Math.round(datos.total / 1.19)
  const items = [
    ...tragos.map((trago) => ({ nombre: trago.nombre, detalle: trago.descripcion, icono: trago.icono })),
    ...(datos.cartaId === 'reducida' ? [
      { nombre: '3 mocktails a elección', detalle: 'Elige 3 de las siguientes 4 preparaciones sin alcohol.', icono: '24' },
      ...MOCKTAILS_WEB.map((trago) => ({ nombre: trago.nombre, detalle: trago.descripcion, icono: trago.icono })),
    ] : []),
    { nombre: 'Bebidas y agua', detalle: bebidasDeCarta(datos.cartaId), icono: '2' },
  ]
  const fechaVisible = datos.fecha.split('-').reverse().join('/')
  const pagina = pdf.addPage([ANCHO, ALTO])

  pagina.drawRectangle({ x: 0, y: 750, width: ANCHO, height: ALTO - 750, color: ROJO })
  pagina.drawImage(logo, { x: ANCHO - 92, y: 773, width: 51, height: 50 })
  linea(pagina, 'RUTABAR / BARRA LIBRE PARA EVENTOS', MARGEN, 816, negrita, 8.3, ROJO_CLARO)
  linea(pagina, 'Tu cotización', MARGEN, 774, mairo, 31, BLANCO)
  linea(pagina, `Preparada para ${datos.nombre}`, MARGEN, 759, normal, ajustar(`Preparada para ${datos.nombre}`, normal, 9, 450), BLANCO)

  valor(pagina, 'Fecha', fechaVisible, MARGEN, 732, 102, negrita)
  valor(pagina, 'Comuna', datos.ciudad, 164, 732, 260, negrita)
  valor(pagina, 'Invitados', `${datos.asistentes} personas`, 455, 732, 102, negrita)
  valor(pagina, 'Carta', carta.nombre, MARGEN, 692, 160, negrita)
  valor(pagina, 'Duración', `${datos.duracion} horas de barra libre`, 220, 692, 170, negrita)
  if (datos.whatsapp) valor(pagina, 'WhatsApp', datos.whatsapp, 420, 692, 137, negrita)

  pagina.drawRectangle({ x: MARGEN, y: 599, width: ANCHO - MARGEN * 2, height: 59, color: ROJO_CLARO })
  linea(pagina, 'VALOR NETO', MARGEN + 12, 642, negrita, 8.5, ROJO)
  linea(pagina, `${clp(totalNeto)} + IVA`, MARGEN + 12, 613, negrita, ajustar(`${clp(totalNeto)} + IVA`, negrita, 21, 180), ROJO)
  linea(pagina, 'TOTAL CON IVA INCLUIDO', 242, 642, negrita, 7.2, ROJO)
  linea(pagina, clp(datos.total), 242, 615, negrita, ajustar(clp(datos.total), negrita, 13, 145))
  linea(pagina, `Reserva: ${clp(datos.montoReserva)}`, 400, 638, normal, 8, TINTA)
  linea(pagina, `Saldo: ${clp(datos.montoSaldo)}`, 400, 622, normal, 8, TINTA)
  linea(pagina, 'Pago: 50% al reservar y 50% el día del evento.', MARGEN, 582, normal, 8.5, SUAVE)

  linea(pagina, carta.nombre, MARGEN, 552, mairo, 24, ROJO)
  linea(pagina, 'Preparaciones incluidas durante las horas contratadas', 300, 552, normal, 8, SUAVE)
  pagina.drawLine({ start: { x: MARGEN, y: 541 }, end: { x: ANCHO - MARGEN, y: 541 }, color: ROJO_CLARO, thickness: 0.8 })

  const iconos = new Map<string, PDFImage>()
  const filas = Math.ceil(items.length / 2)
  const altoFila = Math.min(29.5, 266 / filas)
  for (const [indice, item] of items.entries()) {
    const columna = Math.floor(indice / filas)
    const fila = indice % filas
    const x = MARGEN + columna * 268
    const y = 531 - fila * altoFila
    let icono = iconos.get(item.icono)
    if (!icono) {
      icono = await pdf.embedPng(await readFile(path.join(process.cwd(), 'public', 'carta-pdf', 'iconos', `${item.icono}.png`)))
      iconos.set(item.icono, icono)
    }
    pagina.drawImage(icono, { x, y: y - 21, width: 21, height: 21 })
    linea(pagina, item.nombre, x + 27, y - 7, negrita, ajustar(item.nombre, negrita, 9.2, 228))
    const detalle = lineas(item.detalle, normal, 7, 228)
    if (detalle.length > 2) throw new Error(`La descripción de ${item.nombre} no cabe en la carta de cotización`)
    detalle.forEach((fragmento, sublinea) => linea(pagina, fragmento, x + 27, y - 17 - sublinea * 8, normal, 7, SUAVE))
  }

  pagina.drawLine({ start: { x: MARGEN, y: 259 }, end: { x: ANCHO - MARGEN, y: 259 }, color: ROJO_CLARO, thickness: 0.8 })
  linea(pagina, 'CONDICIONES DEL SERVICIO', MARGEN, 244, negrita, 9, ROJO)
  const anchoColumna = 247
  let yIzquierda = 227
  for (const bloque of CONDICIONES.slice(0, 2)) yIzquierda = bloqueCondiciones(pagina, bloque, MARGEN, yIzquierda, anchoColumna, normal, negrita)
  let yDerecha = 227
  for (const bloque of CONDICIONES.slice(2)) yDerecha = bloqueCondiciones(pagina, bloque, 312, yDerecha, anchoColumna, normal, negrita)
  if (Math.min(yIzquierda, yDerecha) < 49) throw new Error('Las condiciones no caben en una página de cotización')

  if (datos.solicitaCartaDigital) {
    linea(pagina, 'Carta digital con branding solicitada sin costo (mínimo 5 días de anticipación).', MARGEN, 54, negrita, 7.5, ROJO)
  }
  pagina.drawLine({ start: { x: MARGEN, y: 40 }, end: { x: ANCHO - MARGEN, y: 40 }, color: ROJO_CLARO, thickness: 0.8 })
  linea(pagina, 'RUTABAR · contacto@rutabar.cl · rutabar.cl', MARGEN, 25, normal, 7.7, SUAVE)

  return pdf.save({ useObjectStreams: true })
}
