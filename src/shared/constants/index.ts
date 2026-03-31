/**
 * Constantes globales de la aplicación
 * Tipadas para TypeScript
 */

import type { Especie, Tamanio, Sexo, AnimalEstado } from '@/domain/entities/animal'
import type { SolicitudEstado, TipoVivienda } from '@/domain/entities/adoption-request'

// ============================================
// TIPOS PARA OPCIONES
// ============================================

interface SelectOption<T = string> {
  value: T
  label: string
}

interface StatusOption<T = string> extends SelectOption<T> {
  color: string
}

interface NavItem {
  path: string
  label: string
  icon?: string
}

interface FormStep {
  id: number
  title: string
  description: string
}

// ============================================
// ANIMALES
// ============================================

export const ESPECIES: SelectOption<Especie>[] = [
  { value: 'Perro', label: 'Perro' },
  { value: 'Gato', label: 'Gato' },
] as const

export const TAMANIOS: SelectOption<Tamanio>[] = [
  { value: 'Pequeño', label: 'Pequeño' },
  { value: 'Mediano', label: 'Mediano' },
  { value: 'Grande', label: 'Grande' },
] as const

export const SEXOS: SelectOption<Sexo>[] = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Hembra', label: 'Hembra' },
] as const

export const ESTADOS_ANIMAL: StatusOption<AnimalEstado>[] = [
  { value: 'Disponible', label: 'Disponible', color: 'sage' },
  { value: 'En proceso', label: 'En proceso', color: 'amber' },
  { value: 'Adoptado', label: 'Adoptado', color: 'purple' },
  { value: 'En transito', label: 'En tránsito', color: 'sky' },
] as const

// ============================================
// SOLICITUDES
// ============================================

export const ESTADOS_SOLICITUD: StatusOption<SolicitudEstado>[] = [
  { value: 'Nueva', label: 'Nueva', color: 'blue' },
  { value: 'Revisada', label: 'Revisada', color: 'amber' },
  { value: 'En evaluación', label: 'En evaluación', color: 'sky' },
  { value: 'Aprobada', label: 'Aprobada', color: 'sage' },
  { value: 'Rechazada', label: 'Rechazada', color: 'red' },
] as const

// ============================================
// FORMULARIO DE ADOPCIÓN
// ============================================

export const TIPOS_VIVIENDA: SelectOption<TipoVivienda>[] = [
  { value: 'Casa con patio', label: 'Casa con patio' },
  { value: 'Casa sin patio', label: 'Casa sin patio' },
  { value: 'Departamento', label: 'Departamento' },
  { value: 'Otro', label: 'Otro' },
] as const

export const OPCIONES_SI_NO: SelectOption<boolean>[] = [
  { value: true, label: 'Sí' },
  { value: false, label: 'No' },
] as const

export const ADOPTION_FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Tus datos',
    description: 'Información personal y de contacto',
  },
  {
    id: 2,
    title: 'Tu vivienda',
    description: 'Información sobre tu hogar',
  },
  {
    id: 3,
    title: 'Convivencia',
    description: 'Sobre tu familia y otros animales',
  },
  {
    id: 4,
    title: 'Motivación',
    description: 'Por qué querés adoptar',
  },
] as const

// ============================================
// NAVEGACIÓN
// ============================================

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Animales' },
  { path: '/nosotros', label: 'Nosotros' },
] as const

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: 'Home' },
  { path: '/admin/animals', label: 'Animales', icon: 'PawPrint' },
  { path: '/admin/requests', label: 'Solicitudes', icon: 'Inbox' },
] as const

// ============================================
// LÍMITES Y CONFIGURACIÓN
// ============================================

export const LIMITS = {
  MAX_PHOTOS: 5,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  MIN_AGE_ADOPTION: 18,
  MAX_DESCRIPTION_LENGTH: 2000,
} as const

// ============================================
// MENSAJES
// ============================================

export const MESSAGES = {
  // Éxito
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  LOGOUT_SUCCESS: 'Sesión cerrada',
  ANIMAL_CREATED: 'Animal creado correctamente',
  ANIMAL_UPDATED: 'Animal actualizado correctamente',
  ANIMAL_DELETED: 'Animal eliminado correctamente',
  REQUEST_SENT: 'Solicitud enviada correctamente',
  REQUEST_UPDATED: 'Solicitud actualizada correctamente',

  // Errores
  LOGIN_ERROR: 'Email o contraseña incorrectos',
  NETWORK_ERROR: 'Error de conexión. Verificá tu internet.',
  GENERIC_ERROR: 'Ocurrió un error. Intentá de nuevo.',
  NOT_FOUND: 'No se encontró el recurso solicitado',
  UNAUTHORIZED: 'No tenés permisos para esta acción',
  FILE_TOO_LARGE: 'El archivo es demasiado grande (máximo 5MB)',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido. Usá JPG, PNG o WebP',

  // Confirmaciones
  CONFIRM_DELETE_ANIMAL: '¿Estás seguro de eliminar este animal? Esta acción no se puede deshacer.',
  CONFIRM_DELETE_REQUEST: '¿Estás seguro de eliminar esta solicitud?',
  CONFIRM_LOGOUT: '¿Querés cerrar sesión?',
} as const

// Export types
export type { SelectOption, StatusOption, NavItem, FormStep }
