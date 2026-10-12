import { redirect } from 'next/navigation'

// La calculadora pública se encuentra en /cotizar; la gestión financiera sigue
// en el portal privado y no se publica desde este dominio.
export default function PaginaCotizador() {
  redirect('/cotizar')
}
