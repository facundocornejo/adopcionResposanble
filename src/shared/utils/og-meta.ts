/**
 * Actualiza las meta tags Open Graph dinámicamente
 * para que WhatsApp/Facebook muestren preview con foto al compartir
 */

interface OGData {
  title: string
  description: string
  image: string
  url: string
}

function setMetaTag(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

export function updateOGMeta(data: OGData) {
  setMetaTag('og:title', data.title)
  setMetaTag('og:description', data.description)
  setMetaTag('og:image', data.image)
  setMetaTag('og:url', data.url)
  setMetaTag('og:type', 'article')

  // También actualizar el título del documento
  document.title = `${data.title} | Adopta.`
}

export function resetOGMeta() {
  setMetaTag('og:title', 'Adopta. | Encontrá tu compañero')
  setMetaTag('og:description', 'Plataforma de adopción responsable de animales. Encontrá a tu próximo compañero de vida.')
  setMetaTag('og:image', '/og-default.jpg')
  setMetaTag('og:url', window.location.origin)
  setMetaTag('og:type', 'website')
  document.title = 'Adopta. | Encontrá tu compañero'
}
