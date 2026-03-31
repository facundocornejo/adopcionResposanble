/**
 * Utilidades para compartir animales en redes sociales
 */

import { truncate } from './formatters'

export interface ShareableAnimal {
  id: number
  nombre: string
  especie: string
  edad_aproximada: string
  estado: string
  descripcion_historia?: string | null
  foto_principal?: string
}

/**
 * Genera la URL pública del detalle de un animal
 */
export function getAnimalShareUrl(animalId: number): string {
  return `${window.location.origin}/animal/${animalId}`
}

/**
 * Genera el mensaje pre-armado para compartir un animal
 */
export function generateShareMessage(animal: ShareableAnimal): string {
  const url = getAnimalShareUrl(animal.id)
  const descripcion = animal.descripcion_historia
    ? `\n${truncate(animal.descripcion_historia, 100)}`
    : ''

  return `🐾 ¡${animal.nombre} busca hogar!\n${animal.especie} · ${animal.edad_aproximada}\n\n👉 Conocé su historia: ${url}\n${descripcion}\n\nEstado: ${animal.estado}`
}

/**
 * Comparte via WhatsApp (abre en nueva pestaña)
 */
export function shareToWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer')
}

/**
 * Genera la URL de Facebook Sharer con el parámetro quote para pre-rellenar el texto
 */
export function getFacebookShareUrl(animalId: number, quoteText: string): string {
  const url = encodeURIComponent(getAnimalShareUrl(animalId))
  const quote = encodeURIComponent(quoteText)
  return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`
}

/**
 * Comparte usando Web Share API nativa (mobile)
 * Permite compartir a Instagram Stories, WhatsApp, etc. con foto
 */
export async function shareNative(animal: ShareableAnimal): Promise<boolean> {
  if (!navigator.share) return false

  const message = generateShareMessage(animal)

  const shareData: ShareData = {
    title: `${animal.nombre} busca hogar!`,
    text: message,
  }

  // Intentar compartir con la foto si está disponible
  if (animal.foto_principal && navigator.canShare) {
    try {
      const response = await fetch(animal.foto_principal)
      const blob = await response.blob()
      const file = new File([blob], `${animal.nombre}.jpg`, { type: blob.type || 'image/jpeg' })
      const dataWithFile = { ...shareData, files: [file] }

      if (navigator.canShare(dataWithFile)) {
        await navigator.share(dataWithFile)
        return true
      }
    } catch {
      // Si falla con foto, intentar sin ella
    }
  }

  try {
    await navigator.share(shareData)
    return true
  } catch {
    return false
  }
}

/**
 * Copia el texto para Instagram al portapapeles
 */
export async function copyForInstagram(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

/**
 * Detecta si el usuario está en mobile
 */
export function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}
