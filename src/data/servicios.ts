export type Segmento = {
  id: string
  nombre: string
  gancho: string
  paraQuien: string
  criterio: string
}

export const SEGMENTOS: Segmento[] = [
  {
    id: 'privados',
    nombre: 'Privados',
    gancho: 'Cumpleaños, aniversarios y reuniones en casa',
    paraQuien: 'Cumpleaños, aniversarios y reuniones en casa. Montamos la barra en el espacio disponible y atendemos a tus invitados durante el servicio.',
    criterio: 'Celebraciones privadas',
  },
  {
    id: 'celebraciones',
    nombre: 'Celebraciones',
    gancho: 'Matrimonios, titulaciones y fiestas grandes',
    paraQuien: 'Matrimonios, titulaciones y fiestas donde la barra debe mantener el ritmo y la calidad durante todo el evento.',
    criterio: 'Matrimonios y fiestas',
  },
  {
    id: 'empresas',
    nombre: 'Empresas y productoras',
    gancho: 'Corporativos, lanzamientos y catering',
    paraQuien: 'Corporativos, lanzamientos y producciones que necesitan sumar una barra móvil atendida y coordinada con el evento.',
    criterio: 'Eventos de empresa',
  },
]
