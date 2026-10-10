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
    paraQuien: 'Una barra atendida en el espacio de tu celebración.',
    criterio: 'Celebraciones privadas',
  },
  {
    id: 'celebraciones',
    nombre: 'Celebraciones',
    gancho: 'Matrimonios, titulaciones y fiestas grandes',
    paraQuien: 'Servicio ágil para que cada ronda acompañe la fiesta.',
    criterio: 'Matrimonios y fiestas',
  },
  {
    id: 'empresas',
    nombre: 'Empresas y productoras',
    gancho: 'Corporativos, lanzamientos y catering',
    paraQuien: 'Coordinamos el servicio con los tiempos de tu producción.',
    criterio: 'Eventos de empresa',
  },
]
