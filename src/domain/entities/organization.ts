/**
 * Organization Entity
 * Representa una organización/refugio que publica animales
 */

export interface Organizacion {
  id: number
  nombre: string
  slug: string
  email: string | null
  telefono: string | null
  whatsapp: string | null
  direccion: string | null
  logo_url: string | null
  descripcion: string | null
  instagram: string | null
  facebook: string | null
  donacion_alias: string | null
  donacion_cbu: string | null
  donacion_info: string | null
  activa: boolean
}

// Para actualizar organización
export interface OrganizacionInput {
  nombre?: string
  email?: string | null
  telefono?: string | null
  whatsapp?: string | null
  direccion?: string | null
  logo_url?: string | null
  descripcion?: string | null
  instagram?: string | null
  facebook?: string | null
  donacion_alias?: string | null
  donacion_cbu?: string | null
  donacion_info?: string | null
}

// Helper: verificar si tiene información de donación
export function hasDonationInfo(org: Organizacion): boolean {
  return !!(org.donacion_alias || org.donacion_cbu || org.donacion_info)
}

// Helper: verificar si tiene redes sociales
export function hasSocialMedia(org: Organizacion): boolean {
  return !!(org.instagram || org.facebook)
}
