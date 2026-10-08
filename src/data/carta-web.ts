/** Modelo público de la carta: no depende del catálogo interno de recetas. */
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
    descripcion: 'El spritz naranja que ya conoce todo el mundo.', vaso: 'Copa de vino 350 ml', garnish: 'Rodaja de naranja', icono: '6', imagen: '/tragos/aperol-spritz.webp',
  }),
  trago({
    id: 'chelada-michelada', nombre: 'Chelada / Michelada', familia: 'con-alcohol', perfil: 'seco', base: 'Cerveza',
    descripcion: 'Cerveza, limón y sal; versión michelada con ají.', vaso: 'Vaso alto 400 ml', garnish: 'Limón y sal', icono: '21', imagen: '/tragos/chelada-michelada.webp',
  }),
  trago({
    id: 'gin-tonic', nombre: 'Gin Tonic', familia: 'con-alcohol', perfil: 'herbal', base: 'Gin',
    descripcion: 'Gin, tónica y romero.', vaso: 'Vaso alto 400 ml', garnish: 'Limón y romero', icono: '18', imagen: '/tragos/gin-tonic.webp',
  }),
  trago({
    id: 'gin-tropical', nombre: 'Gin Tropical', familia: 'con-alcohol', perfil: 'dulce', base: 'Gin',
    descripcion: 'Gin con maracuyá y naranja.', vaso: 'Vaso alto 400 ml', garnish: 'Media luna de naranja', icono: '4', imagen: '/tragos/gin-tropical.webp',
  }),
  trago({
    id: 'mojito', nombre: 'Mojito', familia: 'con-alcohol', perfil: 'herbal', base: 'Ron',
    descripcion: 'Ron, menta machacada y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Ramillete de menta', icono: '7', imagen: '/tragos/mojito.webp',
  }),
  trago({
    id: 'moscow-mule', nombre: 'Moscow Mule', familia: 'con-alcohol', perfil: 'burbujeante', base: 'Vodka',
    descripcion: 'Vodka, ginger beer y limón.', vaso: 'Jarra de cobre 400 ml', garnish: 'Limón y jengibre', icono: '19', imagen: '/tragos/moscow-mule.webp',
  }),
  trago({
    id: 'palomami', nombre: 'Palomami', familia: 'con-alcohol', perfil: 'citrico', base: 'Tequila',
    descripcion: 'Tequila, pomelo y limón con burbujas.', vaso: 'Vaso alto 400 ml', garnish: 'Pomelo y borde de sal', icono: '27', imagen: '/tragos/palomami.webp',
  }),
  trago({
    id: 'passion-sour', nombre: 'Passion Sour', familia: 'con-alcohol', perfil: 'citrico', base: 'Pisco',
    descripcion: 'Pisco, maracuyá y limón con merengue.', vaso: 'Copa sour 250 ml', garnish: 'Amargo de angostura y media maracuyá', icono: '5', imagen: '/tragos/passion-sour.webp',
  }),
  trago({
    id: 'pisco-sour', nombre: 'Pisco Sour', familia: 'con-alcohol', perfil: 'citrico', base: 'Pisco',
    descripcion: 'Pisco, limón y merengue.', vaso: 'Copa sour 250 ml', garnish: 'Amargo de angostura sobre la espuma', icono: '5', imagen: '/tragos/pisco-sour.webp',
  }),
  trago({
    id: 'ramazzotti-rosato-spritz', nombre: 'Ramazzotti Rosato Spritz', familia: 'con-alcohol', perfil: 'burbujeante', base: 'Ramazzotti Rosato',
    descripcion: 'Spritz rosado, burbujeante y de trago largo.', vaso: 'Copa de vino 350 ml', garnish: 'Rodaja de naranja', icono: '8', imagen: '/tragos/ramazzotti-rosato-spritz.webp',
  }),
  trago({
    id: 'tequilazo', nombre: 'Tequilazo', familia: 'con-alcohol', perfil: 'seco', base: 'Tequila',
    descripcion: 'Shot de tequila con sal y limón de pica.', vaso: 'Shot 60 ml', garnish: 'Cuarto de limón', icono: '3', imagen: '/tragos/tequilazo.webp',
  }),
  trago({
    id: 'tom-collins', nombre: 'Tom Collins', familia: 'con-alcohol', perfil: 'burbujeante', base: 'Gin',
    descripcion: 'Gin, limón, jarabe y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Limón y cereza marrasquino', icono: '22', imagen: '/tragos/tom-collins.webp',
  }),
  trago({
    id: 'vodka-tropical', nombre: 'Vodka Tropical', familia: 'con-alcohol', perfil: 'dulce', base: 'Vodka',
    descripcion: 'Vodka con maracuyá, piña y naranja.', vaso: 'Vaso alto 400 ml', garnish: 'Naranja y rodaja de piña', icono: '4', imagen: '/tragos/vodka-tropical.webp',
  }),
  trago({
    id: 'mocktail-citrico', nombre: 'Mocktail Cítrico', familia: 'sin-alcohol', perfil: 'citrico', base: 'Pomelo',
    descripcion: 'Pomelo, limón y tónica con romero.', vaso: 'Vaso alto 400 ml', garnish: 'Romero y lámina de pomelo', icono: '27', imagen: '/tragos/mocktail-citrico.webp',
  }),
  trago({
    id: 'mocktail-tropical', nombre: 'Mocktail Tropical', familia: 'sin-alcohol', perfil: 'dulce', base: 'Maracuyá',
    descripcion: 'Maracuyá, naranja y soda.', vaso: 'Vaso alto 400 ml', garnish: 'Media luna de naranja', icono: '23', imagen: '/tragos/mocktail-tropical.webp',
  }),
  trago({
    id: 'mocktail-mojito', nombre: 'Mocktail Mojito', familia: 'sin-alcohol', perfil: 'herbal', base: 'Menta y lima',
    descripcion: 'Menta machacada, lima y té verde helado.', vaso: 'Vaso alto 400 ml', garnish: 'Ramillete de menta', icono: '24', imagen: '/tragos/mocktail-mojito.webp',
  }),
  trago({
    id: 'mocktail-ginger-tropical', nombre: 'Mocktail Ginger Tropical', familia: 'sin-alcohol', perfil: 'burbujeante', base: 'Ginger beer',
    descripcion: 'Ginger beer, piña y lima con jengibre fresco.', vaso: 'Jarra de cobre 400 ml', garnish: 'Lima y jengibre', icono: '19', imagen: '/tragos/mocktail-ginger-tropical.webp',
  }),
]

export const BEBIDAS_Y_AGUA = [
  'Cerveza',
  'Coca-Cola',
  'Jugo',
  'Otra bebida sin alcohol',
  'Sprite',
  'Vino blanco',
  'Vino tinto',
  'Agua',
] as const

export const ALTERNATIVAS_CARTA = [
  {
    nombre: 'Barra reducida',
    cantidad: '7 tipos',
    detalle: 'Cerveza, vino tinto, vino blanco, Mojito, Gin Tonic, Pisco Sour y Vodka Tropical.',
  },
  {
    nombre: 'Carta completa',
    cantidad: '25 tipos',
    detalle: 'Todos los cócteles, bebidas, cervezas, vinos, agua y 4 mocktails.',
  },
  {
    nombre: 'Solo sin alcohol',
    cantidad: '9 tipos',
    detalle: 'Coca-Cola, jugo, otra bebida sin alcohol, Sprite, 4 mocktails y agua.',
  },
] as const

export const TRAGOS_WEB_CON_ALCOHOL = CARTA_WEB.filter((item) => item.familia === 'con-alcohol')
export const MOCKTAILS_WEB = CARTA_WEB.filter((item) => item.familia === 'sin-alcohol')
