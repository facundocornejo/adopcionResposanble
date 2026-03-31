/**
 * Animal Entity
 * Representa un animal disponible para adopción
 */

// Union types para validación estricta
export type Especie = 'Perro' | 'Gato'
export type Sexo = 'Macho' | 'Hembra'
export type Tamanio = 'Pequeño' | 'Mediano' | 'Grande'
export type AnimalEstado = 'Disponible' | 'En proceso' | 'Adoptado' | 'En transito'

// Información resumida de organización (para listados)
export interface OrganizacionResumen {
  nombre: string
  slug: string
}

// Información extendida de organización (para detalle de animal)
export interface OrganizacionDetalle extends OrganizacionResumen {
  email?: string | null
  telefono?: string | null
  whatsapp?: string | null
  instagram?: string | null
  facebook?: string | null
  donacion_alias?: string | null
  donacion_info?: string | null
}

// Entidad principal
export interface Animal {
  id: number
  nombre: string
  especie: Especie
  sexo: Sexo
  edad_aproximada: string
  tamanio: Tamanio
  raza_mezcla: string | null
  descripcion_historia: string
  estado_castracion: boolean
  estado_vacunacion: string | null
  estado_desparasitacion: boolean
  socializa_perros: boolean | null  // null = no se sabe
  socializa_gatos: boolean | null
  socializa_ninos: boolean | null
  necesidades_especiales: string | null
  tipo_hogar_ideal: string | null
  estado: AnimalEstado
  publicado_por: string
  contacto_rescatista: string
  foto_principal: string
  foto_2: string | null
  foto_3: string | null
  foto_4: string | null
  foto_5: string | null
  fecha_publicacion: string  // ISO 8601
  organizacion?: OrganizacionResumen
}

// Animal con detalles de organización (para página de detalle)
export interface AnimalDetalle extends Omit<Animal, 'organizacion'> {
  organizacion?: OrganizacionDetalle
}

// Para crear/editar animal
export interface AnimalInput {
  nombre: string
  especie: Especie
  sexo: Sexo
  edad_aproximada: string
  tamanio: Tamanio
  raza_mezcla?: string | null
  descripcion_historia: string
  estado_castracion: boolean
  estado_vacunacion?: string | null
  estado_desparasitacion: boolean
  socializa_perros?: boolean | null
  socializa_gatos?: boolean | null
  socializa_ninos?: boolean | null
  necesidades_especiales?: string | null
  tipo_hogar_ideal?: string | null
  estado?: AnimalEstado
  publicado_por: string
  contacto_rescatista: string
  foto_principal: string
  foto_2?: string | null
  foto_3?: string | null
  foto_4?: string | null
  foto_5?: string | null
}

// Filtros para búsqueda
export interface AnimalFilters {
  especie?: Especie
  tamanio?: Tamanio
  estado?: AnimalEstado
  busqueda?: string
  page?: number
  limit?: number
}

// Versión resumida para listados/cards
export interface AnimalResumen {
  id: number
  nombre: string
  especie: Especie
  sexo: Sexo
  edad_aproximada: string
  tamanio: Tamanio
  estado: AnimalEstado
  foto_principal: string
  organizacion?: OrganizacionResumen
}

// Helper: obtener todas las fotos de un animal
export function getAnimalPhotos(animal: Animal): string[] {
  return [
    animal.foto_principal,
    animal.foto_2,
    animal.foto_3,
    animal.foto_4,
    animal.foto_5,
  ].filter((foto): foto is string => foto !== null)
}

// Helper: verificar si animal está disponible para adopción
export function isAnimalAvailable(animal: Animal): boolean {
  return animal.estado === 'Disponible' || animal.estado === 'En proceso'
}
