/**
 * Auth Service Interface (Port)
 * Define el contrato para autenticación
 */

import type { Admin, AuthSession, LoginCredentials } from '../entities/admin'

export interface IAuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  login(credentials: LoginCredentials): Promise<AuthSession>

  /**
   * Cierra la sesión actual
   */
  logout(): void

  /**
   * Verifica si el token actual es válido
   */
  verifyToken(): Promise<Admin>

  /**
   * Obtiene el token guardado
   */
  getToken(): string | null

  /**
   * Verifica si hay una sesión activa
   */
  isAuthenticated(): boolean
}
