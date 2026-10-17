/**
 * Carta compartida por la web y el PDF de cotización.
 * Ingredientes contrastados el 17-10-2026 con RUTABAR-finanzas:
 * recetas base de data/workbook.json y modificaciones vigentes de records.
 * Las descripciones son para clientes; las dosis y costos quedan en finanzas.
 */
export type FamiliaTrago = 'con-alcohol' | 'sin-alcohol'
export type PerfilTrago = 'burbujeante' | 'citrico' | 'dulce' | 'seco' | 'herbal'

export type TragoWeb = {
  id: string
  nombre: string
  familia: FamiliaTrago
  perfil: PerfilTrago
  base: string
  descripcion: string
  vaso: string
  garnish: string
  icono: string
  imagen: string
}

export const ETIQUETA_PERFIL: Record<PerfilTrago, string> = {
  burbujeante: 'Burbujeante',
  citrico: 'Cítrico',
  dulce: 'Dulce',
  seco: 'Seco',
  herbal: 'Herbal',
}

export const PERFILES: PerfilTrago[] = ['burbujeante', 'citrico', 'dulce', 'seco', 'herbal']

const trago = (item: TragoWeb): TragoWeb => item

export const CARTA_WEB: TragoWeb[] = [
  trago({
    id: 'aperol-spritz', nombre: 'Aperol Spritz', familia: 'con-alcohol', perfil: 'burbujeante', base: 'Aperol',
    descripcion: 'Aperol, espumante brut y soda con naranja.', vaso: 'Copa de vino 350 ml', garnish: 'Rodaja de naranja', icono: '6', imagen: '/tragos/aperol-spritz.webp',
  }),
  trago({
    id: 'chelada-michelada', nombre: 'Chelada / Michelada', familia: 'con-alcohol', perfil: 'seco', base: 'Cerveza Corona',
    descripcion: 'Cerveza Corona, limón y sal; versión michelada con ají.', vaso: 'Vaso alto 400 ml', garnish: 'Limón, sal y ají opcional', icono: '21', imagen: '/tragos/chelada-michelada.webp',
  }),
  trago({
    id: 'gin-tonic', nombre: 'Gin Tonic', familia: 'con-alcohol', perfil: 'herbal', base: 'Gin',
    descripcion: 'Gin, tónica, limón y romero.', vaso: 'Vaso alto 400 ml', garnish: 'Limón y romero', icono: '18', imagen: '/tragos/gin-tonic.webp',
  }),
  trago({
    id: 'gin-tropical', nombre: 'Gin Tropical', familia: 'con-alcohol', perfil: 'dulce', base: 'Gin',
    descripcion: 'Gin, Red Bull Yellow, maracuyá y limón.', vaso: 'Vaso alto 400 ml', garnish: 'Naranja fresca', icono: '4', imagen: '/tragos/gin-tropical.webp',
  }),
  trago({
    id: 'mojito', nombre: 'Mojito', familia: 'con-alcohol', perfil: 'herbal', base: 'Ron',
    descripcion: 'Ron Maddero blanco, limón, menta, azúcar y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Menta fresca', icono: '7', imagen: '/tragos/mojito.webp',
  }),
  trago({
    id: 'moscow-mule', nombre: 'Moscow Mule', familia: 'con-alcohol', perfil: 'burbujeante', base: 'Vodka Absolut',
    descripcion: 'Vodka Absolut, ginger beer Jesuita y limón.', vaso: 'Vaso alto 400 ml', garnish: 'Limón', icono: '19', imagen: '/tragos/moscow-mule.webp',
  }),
  trago({
    id: 'palomami', nombre: 'Palomami', familia: 'con-alcohol', perfil: 'citrico', base: 'Tequila',
    descripcion: 'Tequila José Cuervo, Fanta Pomelo y limón con sal.', vaso: 'Vaso alto 400 ml', garnish: 'Guarnición cítrica y sal', icono: '27', imagen: '/tragos/palomami.webp',
  }),
  trago({
    id: 'passion-sour', nombre: 'Passion Sour', familia: 'con-alcohol', perfil: 'citrico', base: 'Pisco',
    descripcion: 'Sour de maracuyá Campanario, listo para servir y decorar.', vaso: 'Copa sour 250 ml', garnish: 'Guarnición cítrica', icono: '5', imagen: '/tragos/passion-sour.webp',
  }),
  trago({
    id: 'pisco-sour', nombre: 'Pisco Sour', familia: 'con-alcohol', perfil: 'citrico', base: 'Pisco',
    descripcion: 'Pisco Sour Campanario, listo para servir y decorar.', vaso: 'Copa sour 250 ml', garnish: 'Guarnición cítrica', icono: '5', imagen: '/tragos/pisco-sour.webp',
  }),
  trago({
    id: 'ramazzotti-rosato-spritz', nombre: 'Ramazzotti Rosato Spritz', familia: 'con-alcohol', perfil: 'burbujeante', base: 'Ramazzotti Rosato',
    descripcion: 'Ramazzotti Rosato, espumante brut y soda con naranja.', vaso: 'Copa de vino 350 ml', garnish: 'Rodaja de naranja', icono: '8', imagen: '/tragos/ramazzotti-rosato-spritz.webp',
  }),
  trago({
    id: 'tequilazo', nombre: 'Tequilazo', familia: 'con-alcohol', perfil: 'seco', base: 'Tequila',
    descripcion: 'Shot de tequila con sal y limón.', vaso: 'Shot 60 ml', garnish: 'Limón y sal', icono: '3', imagen: '/tragos/tequilazo.webp',
  }),
  trago({
    id: 'tom-collins', nombre: 'Tom Collins', familia: 'con-alcohol', perfil: 'burbujeante', base: 'Gin',
    descripcion: 'Gin, limón, jarabe de azúcar y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Guarnición cítrica', icono: '22', imagen: '/tragos/tom-collins.webp',
  }),
  trago({
    id: 'mocktail-citrico', nombre: 'Mocktail Cítrico', familia: 'sin-alcohol', perfil: 'citrico', base: 'Limón',
    descripcion: 'Limón, jarabe de azúcar y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Guarnición cítrica', icono: '27', imagen: '/tragos/mocktail-citrico.webp',
  }),
  trago({
    id: 'mocktail-tropical', nombre: 'Mocktail Tropical', familia: 'sin-alcohol', perfil: 'dulce', base: 'Maracuyá',
    descripcion: 'Maracuyá, piña, limón, jarabe de azúcar y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Guarnición de fruta', icono: '23', imagen: '/tragos/mocktail-tropical.webp',
  }),
  trago({
    id: 'mocktail-mojito', nombre: 'Mocktail Mojito', familia: 'sin-alcohol', perfil: 'herbal', base: 'Menta y limón',
    descripcion: 'Menta, limón, jarabe de azúcar y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Menta y guarnición cítrica', icono: '24', imagen: '/tragos/mocktail-mojito.webp',
  }),
  trago({
    id: 'mocktail-ginger-tropical', nombre: 'Mocktail Ginger Tropical', familia: 'sin-alcohol', perfil: 'burbujeante', base: 'Ginger beer',
    descripcion: 'Ginger beer, maracuyá, piña, limón y jarabe de azúcar.', vaso: 'Jarra de cobre 400 ml', garnish: 'Guarnición de fruta', icono: '19', imagen: '/tragos/mocktail-ginger-tropical.webp',
  }),
]

export const BEBIDAS_Y_AGUA = [
  { nombre: 'Cerveza', tipo: 'Con alcohol', icono: '21', cartas: ['Ruta Esencial', 'Ruta Full'] },
  { nombre: 'Coca-Cola', tipo: 'Sin alcohol', icono: '22', cartas: ['Ruta Full', 'Ruta Zero'] },
  { nombre: 'Jugo', tipo: 'Sin alcohol', icono: '4', cartas: ['Ruta Full', 'Ruta Zero'] },
  { nombre: 'Sprite', tipo: 'Sin alcohol', icono: '22', cartas: ['Ruta Full', 'Ruta Zero'] },
  { nombre: 'Otra bebida sin alcohol', tipo: 'Sin alcohol', icono: '22', cartas: ['Ruta Full', 'Ruta Zero'] },
  { nombre: 'Vino blanco', tipo: 'Con alcohol', icono: '6', cartas: ['Ruta Esencial', 'Ruta Full'] },
  { nombre: 'Vino tinto', tipo: 'Con alcohol', icono: '6', cartas: ['Ruta Esencial', 'Ruta Full'] },
  { nombre: 'Agua', tipo: 'Sin alcohol', icono: '24', cartas: ['Ruta Esencial', 'Ruta Full', 'Ruta Zero'] },
] as const

export const ALTERNATIVAS_CARTA = [
  {
    nombre: 'Ruta Esencial',
    cantidad: '10 opciones · 5 horas de referencia',
    detalle: 'Cerveza, vino tinto, vino blanco, Mojito, Gin Tonic, Pisco Sour, Gin Tropical y 3 mocktails a elección. Agua incluida.',
  },
  {
    nombre: 'Ruta Full',
    cantidad: '24 opciones · 5 horas de referencia',
    detalle: '11 cócteles (7 clásicos y 4 de autor), 1 shot de tequila, 4 mocktails y 8 opciones entre cerveza, vinos, bebidas, jugo y agua.',
  },
  {
    nombre: 'Ruta Zero',
    cantidad: '9 opciones · 5 horas de referencia',
    detalle: '4 mocktails, Coca-Cola, jugo, Sprite, otra bebida sin alcohol y agua.',
  },
] as const

export const TRAGOS_WEB_CON_ALCOHOL = CARTA_WEB.filter((item) => item.familia === 'con-alcohol')
export const MOCKTAILS_WEB = CARTA_WEB.filter((item) => item.familia === 'sin-alcohol')
