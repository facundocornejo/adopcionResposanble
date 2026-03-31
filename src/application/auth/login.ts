/**
 * Login Use Case
 * Maneja el proceso de inicio de sesión
 */

import type { AuthSession, LoginCredentials } from '@/domain/entities/admin'
import type { IAuthService } from '@/domain/interfaces/auth-service'
import { ValidationError } from '@/domain/errors'

export class LoginUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(credentials: LoginCredentials): Promise<AuthSession> {
    // Validaciones básicas
    if (!credentials.email?.trim()) {
      throw new ValidationError('El email es requerido', 'email')
    }

    if (!credentials.password) {
      throw new ValidationError('La contraseña es requerida', 'password')
    }

    if (credentials.password.length < 6) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres', 'password')
    }

    return this.authService.login(credentials)
  }
}
