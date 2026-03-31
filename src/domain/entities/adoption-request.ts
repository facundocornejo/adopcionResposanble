/**
 * Adoption Request Entity
 * Representa una solicitud de adopción enviada por un usuario
 */

export type SolicitudEstado = 'Nueva' | 'Revisada' | 'En evaluación' | 'Aprobada' | 'Rechazada'
export type TipoVivienda = 'Casa con patio' | 'Casa sin patio' | 'Departamento' | 'Otro'

// Info resumida del animal asociado
export interface AnimalSolicitud {
  id: number
  nombre: string
  especie: string
  tamanio?: string
  edad_aproximada?: string
  foto_principal: string
}

// Entidad principal
export interface SolicitudAdopcion {
  id: number
  animal_id: number
  nombre_completo: string
  edad: number
  email: string
  telefono_whatsapp: string
  instagram?: string | null
  ciudad_zona: string
  tipo_vivienda: TipoVivienda
  // Vivienda
  vivienda_propia: boolean
  permite_mascotas?: boolean | null
  // Convivencia
  cantidad_convivientes: number
  todos_de_acuerdo: boolean
  hay_ninos: boolean
  edades_ninos?: string | null
  // Otros animales
  tiene_otros_animales: boolean
  descripcion_otros_animales?: string | null
  otros_animales_castrados?: boolean | null
  // Experiencia
  experiencia_previa: string
  motivacion: string
  // Compromisos
  compromiso_castracion: boolean
  compromiso_seguimiento: boolean
  // Meta
  fecha_solicitud: string  // ISO 8601
  estado_solicitud: SolicitudEstado
  animal?: AnimalSolicitud
}

// Para enviar una nueva solicitud (matches API schema)
export interface SolicitudInput {
  animal_id: number
  nombre_completo: string
  edad: number
  email: string
  telefono_whatsapp: string
  ciudad_zona: string
  tipo_vivienda: TipoVivienda
  vive_solo_acompanado: string
  todos_de_acuerdo: boolean  // DEBE ser true
  tiene_otros_animales: boolean
  otros_animales_castrados?: string | null  // "Sí" | "No" | null
  experiencia_previa: string
  puede_cubrir_gastos: boolean
  motivacion: string
  compromiso_castracion: boolean  // DEBE ser true
  acepta_contacto: boolean
}

// Filtros para admin
export interface SolicitudFilters {
  estado_solicitud?: SolicitudEstado
  animal_id?: number
  page?: number
  limit?: number
}

// Helper: verificar si solicitud está pendiente de revisión
export function isSolicitudPendiente(solicitud: SolicitudAdopcion): boolean {
  return solicitud.estado_solicitud === 'Nueva' || solicitud.estado_solicitud === 'Revisada'
}
