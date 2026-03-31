/**
 * Super Admin Entities
 * Tipos para las funcionalidades de super-admin
 */

// Admin de una organización (vista desde super-admin)
export interface OrganizacionAdmin {
  id: number
  username: string
  email: string
}

// Organización con conteos (para lista)
export interface OrganizacionConConteos {
  id: number
  nombre: string
  email?: string | null
  telefono?: string | null
  direccion?: string | null
  descripcion?: string | null
  activa: boolean
  administradores: OrganizacionAdmin[]
  _count: {
    animales: number
    administradores: number
  }
}

// Datos para crear nueva organización
export interface CreateOrganizacionInput {
  nombre: string
  email?: string
  telefono?: string
  direccion?: string
  descripcion?: string
  admin_username: string
  admin_email: string
  admin_password: string
}

// Respuesta al crear organización
export interface CreateOrganizacionResponse {
  organizacion: {
    id: number
    nombre: string
  }
  credenciales: {
    username: string
    password: string
  }
}

// Solicitud de contacto de rescatista
export type EstadoSolicitudContacto = 'Pendiente' | 'Aprobada' | 'Rechazada'

export interface SolicitudContacto {
  id: number
  nombre_refugio: string
  nombre_contacto: string
  email: string
  telefono: string
  ciudad: string
  descripcion: string
  instagram?: string | null
  facebook?: string | null
  cantidad_animales?: string | null
  estado: EstadoSolicitudContacto
  fecha_solicitud: string
}
