# RUTABAR

Sitio público de RUTABAR, barra móvil de coctelería para eventos en Santiago de Chile. Está construido con Next.js y contiene las páginas de inicio, servicios, carta, condiciones y cotización.

## Desarrollo local

```bash
npm ci
npm run dev
```

Comprobaciones disponibles:

```bash
npm run typecheck
npm run build
```

## Variables de entorno

Copia `.env.example` a `.env.local` para desarrollo. En Vercel, configura estas variables en **Settings → Environment Variables** para Production y Preview:

- `NEXT_PUBLIC_WHATSAPP`: número comercial internacional, solo dígitos.
- `NEXT_PUBLIC_EMAIL`: correo público de contacto.
- `NEXT_PUBLIC_SITIO_URL`: dominio canónico del sitio.
- `RESEND_API_KEY`: clave privada de Resend.
- `RESEND_FROM_EMAIL`: remitente de un dominio verificado en Resend.
- `RESEND_TO_EMAIL`: buzón que recibe las cotizaciones.

Para este sitio, configura `RESEND_FROM_EMAIL=RUTABAR <contacto@rutabar.cl>` y `RESEND_TO_EMAIL=contacto@rutabar.cl`. El dominio `rutabar.cl` debe figurar como verificado en Resend. Si Vercel todavía tiene valores de `barrabar.cl`, cámbialos: las variables de entorno tienen prioridad sobre los valores predeterminados del código.

Al enviar el formulario de `/cotizar`, el servidor calcula el precio con IVA, genera un PDF con la selección de la carta, fotos y condiciones, y envía un único correo al cliente con copia oculta al buzón comercial. El correo del cliente es obligatorio; el precio no se muestra en el formulario. Las imágenes JPEG de `public/carta-pdf/` se incluyen en la función de Vercel mediante `outputFileTracingIncludes`.

Para revisar sin enviar correos reales, ejecuta `npm run pdf:preview` y abre `output/pdf/cotizacion-rutabar-ejemplo.pdf`. Ejecuta `npm run test:cotizacion-email` para simular Resend y comprobar destinatarios, adjunto, precio y condiciones.

Las variables `RESEND_*` son privadas. No les agregues el prefijo `NEXT_PUBLIC_` ni subas `.env.local`.

## Publicación en Vercel

El repositorio está configurado para Next.js en `vercel.json`. Vercel instala dependencias con `npm ci` y compila con `npm run build`. Importa el repositorio en Vercel, usa `./` como directorio raíz, configura las variables anteriores y despliega.
