import { SITIO } from '@/lib/seo'

const MENSAJE_INICIAL = 'Hola, quiero consultar por una barra libre para mi evento.'

export function FloatingWhatsApp() {
  const numero = SITIO.telefono.replace(/\D/g, '')
  if (!numero) return null

  const href = `https://wa.me/${numero}?text=${encodeURIComponent(MENSAJE_INICIAL)}`

  return (
    <a
      className="whatsapp-flotante"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M16 3.5a12.1 12.1 0 0 0-10.4 18.3L4 28l6.4-1.7A12.1 12.1 0 1 0 16 3.5Z" />
        <path d="M11.2 9.6c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.6 1.5 3.8 2.5 4 6.2 5.4c3.1 1.2 3.7 1 4.4.9s2.2-.9 2.5-1.8.3-1.7.2-1.8-.3-.3-.7-.5l-2.5-1.2c-.3-.1-.6-.2-.8.2s-1 1.2-1.2 1.4-.4.3-.8.1a10 10 0 0 1-2.9-1.8 10.7 10.7 0 0 1-2-2.5c-.2-.4 0-.6.1-.8l.6-.7c.2-.2.3-.4.4-.6s.1-.5 0-.7l-1-2.3Z" />
      </svg>
      <span className="whatsapp-flotante__texto">WhatsApp</span>
    </a>
  )
}
