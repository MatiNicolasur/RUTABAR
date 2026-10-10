import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib'
import { ALTERNATIVAS_CARTA, CARTA_WEB, type TragoWeb } from '../data/carta-web'
import { CONDICIONES } from '../data/condiciones'
import { CONFIG_COTIZACION, type CartaCotizacionId, type DuracionCotizacion } from '../data/precios-cotizacion'
import { clp } from './formato'

export type CotizacionPdfDatos = {
  nombre: string
  fecha: string
  ciudad: string
  lugar: string
  asistentes: number
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

function titulo(page: PDFPage, texto: string, x: number, y: number, font: PDFFont, size: number, ancho: number) {
  const ajustado = Math.min(size, size * ancho / font.widthOfTextAtSize(seguro(texto), size))
  linea(page, texto, x, y, font, ajustado, BLANCO)
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

function parrafo(page: PDFPage, texto: string, x: number, y: number, ancho: number, font: PDFFont, size: number, color = TINTA, interlineado = size * 1.42) {
  for (const fragmento of lineas(texto, font, size, ancho)) {
    linea(page, fragmento, x, y, font, size, color)
    y -= interlineado
  }
  return y
}

function pie(page: PDFPage, indice: number, total: number, font: PDFFont) {
  page.drawLine({ start: { x: 42, y: 48 }, end: { x: ANCHO - 42, y: 48 }, thickness: 0.7, color: ROJO_CLARO })
  linea(page, 'RUTABAR · contacto@rutabar.cl · rutabar.cl', 42, 31, font, 8, SUAVE)
  linea(page, `${indice} / ${total}`, ANCHO - 68, 31, font, 8, SUAVE)
}

function tragosDeCarta(cartaId: CartaCotizacionId): TragoWeb[] {
  if (cartaId === 'sin-alcohol') return CARTA_WEB.filter((trago) => trago.familia === 'sin-alcohol')
  if (cartaId === 'reducida') {
    return CARTA_WEB.filter((trago) => ['mojito', 'gin-tonic', 'pisco-sour', 'vodka-tropical'].includes(trago.id))
  }
  return CARTA_WEB
}

function bebidasDeCarta(cartaId: CartaCotizacionId): string {
  if (cartaId === 'sin-alcohol') return 'Coca-Cola, Sprite, jugo, otra bebida sin alcohol y agua.'
  if (cartaId === 'reducida') return 'Cerveza, vino tinto, vino blanco y agua.'
  return 'Cerveza, vinos, bebidas, jugos y agua.'
}

export async function generarCotizacionPdf(datos: CotizacionPdfDatos): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  const normal = await pdf.embedFont(StandardFonts.Helvetica)
  const negrita = await pdf.embedFont(StandardFonts.HelveticaBold)
  const moira = await pdf.embedFont(await readFile(path.join(process.cwd(), 'public', 'carta-pdf', 'Mairo.ttf')))
  const logo = await pdf.embedPng(await readFile(path.join(process.cwd(), 'public', 'carta-pdf', 'logo-blanco.png')))
  const carta = CONFIG_COTIZACION.cartas.find((opcion) => opcion.id === datos.cartaId)!
  const seleccion = ALTERNATIVAS_CARTA.find((opcion) => opcion.nombre === carta.nombre)!
  const tragos = tragosDeCarta(datos.cartaId)
  const fotos = [...tragos.map((trago) => ({ nombre: trago.nombre, base: trago.base, detalle: trago.descripcion, icono: trago.icono, archivo: `${trago.id}.jpg` })), {
    nombre: 'Bebidas y agua', base: 'Para acompañar', detalle: bebidasDeCarta(datos.cartaId), icono: '2', archivo: 'bebidas-agua.jpg',
  }]
  const paginasCarta = Math.ceil(fotos.length / 6)
  const totalPaginas = 2 + paginasCarta
  const fechaVisible = datos.fecha.split('-').reverse().join('/')

  const portada = pdf.addPage([ANCHO, ALTO])
  portada.drawRectangle({ x: 0, y: ALTO - 214, width: ANCHO, height: 214, color: ROJO })
  portada.drawImage(logo, { x: ANCHO - 120, y: ALTO - 104, width: 78, height: 76 })
  linea(portada, 'RUTABAR', 42, ALTO - 71, negrita, 30, BLANCO)
  linea(portada, 'BARRA LIBRE PARA EVENTOS', 43, ALTO - 94, negrita, 9, ROJO_CLARO)
  titulo(portada, 'Tu cotización', 42, ALTO - 158, moira, 38, ANCHO - 84)
  parrafo(portada, `Preparada para ${datos.nombre}`, 43, ALTO - 181, ANCHO - 86, normal, 12, BLANCO, 15)

  linea(portada, 'TU EVENTO', 42, 587, negrita, 10, ROJO)
  const filas = [
    ['Fecha', fechaVisible],
    ['Lugar', `${datos.lugar}, ${datos.ciudad}`],
    ['Asistentes', `${datos.asistentes} personas`],
    ['Carta', carta.nombre],
    ['Duración', `${datos.duracion} horas de barra libre`],
  ]
  let y = 555
  for (const [etiqueta, valor] of filas) {
    linea(portada, etiqueta, 42, y, normal, 10, SUAVE)
    parrafo(portada, valor, 173, y, 370, negrita, 11)
    portada.drawLine({ start: { x: 42, y: y - 12 }, end: { x: ANCHO - 42, y: y - 12 }, thickness: 0.6, color: ROJO_CLARO })
    y -= 42
  }

  portada.drawRectangle({ x: 42, y: 236, width: ANCHO - 84, height: 80, color: ROJO_CLARO })
  linea(portada, 'TOTAL CON IVA INCLUIDO', 58, 288, negrita, 10, ROJO)
  linea(portada, clp(datos.total), 58, 251, negrita, 27, ROJO)
  linea(portada, `${clp(datos.porPersona)} por persona`, 349, 254, normal, 10, SUAVE)

  linea(portada, 'RESERVA Y PAGO', 42, 207, negrita, 10, ROJO)
  linea(portada, `50% para reservar: ${clp(datos.montoReserva)}`, 42, 181, normal, 11)
  linea(portada, `50% el día del evento: ${clp(datos.montoSaldo)}`, 42, 162, normal, 11)
  parrafo(portada, 'El servicio es barra libre de las bebidas de la carta elegida durante las horas contratadas.', 42, 127, ANCHO - 84, normal, 10, SUAVE)
  if (datos.solicitaCartaDigital) {
    linea(portada, 'Carta digital con branding solicitada, sin costo y con 5 días de anticipación.', 42, 83, normal, 9, ROJO)
  }
  pie(portada, 1, totalPaginas, normal)

  const archivos = new Map<string, Uint8Array>()
  const iconos = new Map<string, PDFImage>()
  for (let paginaIndice = 0; paginaIndice < paginasCarta; paginaIndice++) {
    const pagina = pdf.addPage([ANCHO, ALTO])
    pagina.drawRectangle({ x: 0, y: 735, width: ANCHO, height: ALTO - 735, color: ROJO })
    pagina.drawImage(logo, { x: ANCHO - 101, y: 753, width: 58, height: 56 })
    linea(pagina, 'RUTABAR / LA CARTA', 42, 800, negrita, 10, ROJO_CLARO)
    titulo(pagina, carta.nombre, 42, 755, moira, 32, ANCHO - 155)
    if (paginaIndice === 0) {
      parrafo(pagina, seleccion.detalle, 42, 718, ANCHO - 84, normal, 10, SUAVE)
    }

    const items = fotos.slice(paginaIndice * 6, (paginaIndice + 1) * 6)
    for (const [indice, item] of items.entries()) {
      const columna = indice % 2
      const fila = Math.floor(indice / 2)
      const x = columna === 0 ? 42 : 305
      const baseY = 500 - fila * 205
      pagina.drawRectangle({ x, y: baseY, width: 248, height: 195, borderColor: ROJO_CLARO, borderWidth: 0.8, color: BLANCO })
      let icono = iconos.get(item.icono)
      if (!icono) {
        const bytesIcono = await readFile(path.join(process.cwd(), 'public', 'carta-pdf', 'iconos', `${item.icono}.png`))
        icono = await pdf.embedPng(bytesIcono)
        iconos.set(item.icono, icono)
      }
      pagina.drawImage(icono, { x: x + 12, y: baseY + 150, width: 35, height: 35 })
      const tamanoNombre = Math.min(11, 11 * 181 / negrita.widthOfTextAtSize(seguro(item.nombre), 11))
      linea(pagina, item.nombre, x + 56, baseY + 174, negrita, tamanoNombre)
      linea(pagina, item.base.toUpperCase(), x + 56, baseY + 159, negrita, 7, ROJO)
      const detalle = lineas(item.detalle, normal, 7, 181)
      for (const [lineaIndice, fragmento] of detalle.slice(0, 2).entries()) {
        linea(pagina, fragmento, x + 56, baseY + 146 - lineaIndice * 8, normal, 7, SUAVE)
      }
      let bytes = archivos.get(item.archivo)
      if (!bytes) {
        bytes = await readFile(path.join(process.cwd(), 'public', 'carta-pdf', item.archivo))
        archivos.set(item.archivo, bytes)
      }
      const imagen = await pdf.embedJpg(bytes)
      pagina.drawImage(imagen, { x: x + 9, y: baseY + 9, width: 230, height: 122 })
    }
    pie(pagina, paginaIndice + 2, totalPaginas, normal)
  }

  const condiciones = pdf.addPage([ANCHO, ALTO])
  condiciones.drawRectangle({ x: 0, y: 735, width: ANCHO, height: ALTO - 735, color: ROJO })
  condiciones.drawImage(logo, { x: ANCHO - 101, y: 753, width: 58, height: 56 })
  linea(condiciones, 'RUTABAR / TU EVENTO', 42, 800, negrita, 10, ROJO_CLARO)
  titulo(condiciones, 'Condiciones del servicio', 42, 755, moira, 32, ANCHO - 155)
  let yCondiciones = 696
  for (const bloque of CONDICIONES) {
    linea(condiciones, bloque.titulo.toUpperCase(), 42, yCondiciones, negrita, 11, ROJO)
    yCondiciones -= 24
    for (const punto of bloque.puntos) {
      yCondiciones = parrafo(condiciones, `- ${punto}`, 49, yCondiciones, ANCHO - 95, normal, 10, TINTA, 14) - 9
    }
    yCondiciones -= 13
  }
  pie(condiciones, totalPaginas, totalPaginas, normal)

  return pdf.save({ useObjectStreams: true })
}
