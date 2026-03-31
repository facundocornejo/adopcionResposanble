/**
 * Verify Session Use Case
 * Verifica si la sesión actual es válida
 */

import type { Admin } from '@/domain/entities/admin'
import type { IAuthService } from '@/domain/interfaces/auth-service'

export class VerifySessionUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(): Promise<Admin | null> {
    // Si no hay token, no hay sesión
    if (!this.authService.isAuthenticated()) {
      return null
    }

    try {
      // Verificar token con el backend
      return await this.authService.verifyToken()
    } catch {
      // Token inválido o expirado
      this.authService.logout()
      return null
    }
  }
}
