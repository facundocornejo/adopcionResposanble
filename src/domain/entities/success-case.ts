/**
 * Success Case Entity
 * Representa un caso de éxito de adopción
 */

import type { OrganizacionResumen } from './animal'

// Info del animal adoptado
export interface AnimalCasoExito {
  id: number
  nombre: string
  especie: string
  foto_principal: string
}

// Entidad principal
export interface CasoExito {
  id: number
  titulo: string
  historia: string
  fecha_adopcion: string  // ISO 8601
  fecha_publicacion: string
  foto_actual_1: string | null
  foto_actual_2: string | null
  foto_actual_3: string | null
  animal: AnimalCasoExito
  organizacion?: OrganizacionResumen
}

// Para crear un nuevo caso
export interface CasoExitoInput {
  animal_id: number
  titulo: string
  historia: string
  fecha_adopcion: string  // YYYY-MM-DD
  foto_actual_1?: string | null
  foto_actual_2?: string | null
  foto_actual_3?: string | null
}

// Casos agrupados por organización
export interface CasosPorOrganizacion {
  organizacion: OrganizacionResumen
  casos: CasoExito[]
}

// Helper: obtener todas las fotos del caso
export function getCasoPhotos(caso: CasoExito): string[] {
  return [
    caso.foto_actual_1,
    caso.foto_actual_2,
    caso.foto_actual_3,
  ].filter((foto): foto is string => foto !== null)
}
