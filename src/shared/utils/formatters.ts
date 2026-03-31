/**
 * Funciones utilitarias para formateo de datos
 * Tipadas para TypeScript
 */

import type { AnimalEstado } from '@/domain/entities/animal'
import type { SolicitudEstado } from '@/domain/entities/adoption-request'

// ============================================
// FECHAS
// ============================================

/**
 * Formatea una fecha a formato legible
 */
export function formatDate(
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }

  return dateObj.toLocaleDateString('es-AR', defaultOptions)
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calcula tiempo relativo (hace X minutos/horas/días)
 */
export function timeAgo(date: string | Date | null | undefined): string {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Hace un momento'
  if (minutes < 60) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  if (days < 7) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`

  return formatDate(date)
}

// ============================================
// TEXTOS
// ============================================

/**
 * Capitaliza la primera letra
 */
export function capitalize(text: string | null | undefined): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Trunca texto largo
 */
export function truncate(text: string | null | undefined, maxLength = 100): string {
  if (!text || text.length <= maxLength) return text || ''
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Genera slug a partir de texto
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ============================================
// TELÉFONOS
// ============================================

/**
 * Formatea número de teléfono argentino
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return ''

  // Limpiar todo excepto números
  const cleaned = phone.replace(/\D/g, '')

  // Si tiene 10 dígitos (sin código de país)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  // Si tiene 11 dígitos (con 9 de celular)
  if (cleaned.length === 11 && cleaned.startsWith('9')) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }

  // Si tiene código de país
  if (cleaned.length === 13 && cleaned.startsWith('549')) {
    return `+54 9 (${cleaned.slice(3, 6)}) ${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
  }

  return phone
}

/**
 * Genera link de WhatsApp
 */
export function getWhatsAppLink(phone: string | null | undefined, message = ''): string {
  if (!phone) return ''

  // Limpiar y agregar código de país si no lo tiene
  let cleaned = phone.replace(/\D/g, '')

  if (!cleaned.startsWith('54')) {
    cleaned = '54' + cleaned
  }

  // Agregar 9 si es celular y no lo tiene
  if (cleaned.length === 12 && !cleaned.startsWith('549')) {
    cleaned = '549' + cleaned.slice(2)
  }

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleaned}${message ? `?text=${encodedMessage}` : ''}`
}

// ============================================
// ESTADOS - Mapeo a clases CSS
// ============================================

const animalStatusClasses: Record<AnimalEstado, string> = {
  'Disponible': 'badge-disponible',
  'En proceso': 'badge-en-proceso',
  'Adoptado': 'badge-adoptado',
  'En transito': 'badge-en-transito',
}

/**
 * Obtiene la clase CSS para un estado de animal
 */
export function getAnimalStatusClass(estado: AnimalEstado | string): string {
  return animalStatusClasses[estado as AnimalEstado] || 'bg-gray-100 text-gray-600'
}

const requestStatusClasses: Record<SolicitudEstado, string> = {
  'Nueva': 'bg-blue-100 text-blue-700',
  'Revisada': 'bg-amber-100 text-amber-700',
  'En evaluación': 'bg-sky-100 text-sky-700',
  'Aprobada': 'bg-sage-100 text-sage-600',
  'Rechazada': 'bg-red-100 text-red-600',
}

/**
 * Obtiene la clase CSS para un estado de solicitud
 */
export function getRequestStatusClass(estado: SolicitudEstado | string): string {
  return requestStatusClasses[estado as SolicitudEstado] || 'bg-gray-100 text-gray-600'
}

// ============================================
// NÚMEROS
// ============================================

/**
 * Formatea número con separador de miles
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('es-AR')
}

/**
 * Calcula porcentaje
 */
export function formatPercentage(value: number, total: number): string {
  if (!total || total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${Math.round(percentage)}%`
}

// ============================================
// IMÁGENES
// ============================================

/**
 * Genera URL de placeholder para imágenes
 */
export function getPlaceholderImage(width = 400, height = 300): string {
  return `https://placehold.co/${width}x${height}/FAF7F2/8B7E74?text=Sin+foto`
}

/**
 * Valida si una URL es una imagen válida
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => url.toLowerCase().includes(ext))
}
