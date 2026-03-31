/**
 * Admin Entity
 * Representa un administrador de organización
 */

import type { Organizacion } from './organization'

export interface Admin {
  id: number
  username: string
  nombre: string
  email: string
  es_super_admin: boolean
}

// Datos de sesión completos
export interface AuthSession {
  token: string
  admin: Admin
  organizacion: Organizacion
}

// Credenciales de login
export interface LoginCredentials {
  email: string
  password: string
}

// Estado de autenticación
export interface AuthState {
  admin: Admin | null
  organizacion: Organizacion | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Helper: verificar si es super admin
export function isSuperAdmin(admin: Admin | null): boolean {
  return admin?.es_super_admin === true
}
