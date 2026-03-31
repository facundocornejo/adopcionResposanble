/**
 * Auth API Adapter
 * Implementa IAuthService usando la API REST
 */

import api from './axios-client'
import type { Admin, AuthSession, LoginCredentials } from '@/domain/entities/admin'
import type { IAuthService } from '@/domain/interfaces/auth-service'
import type { ApiResponse } from '@/domain/interfaces/common'

// Tipo de respuesta de la API para login
interface LoginApiResponse {
  token: string
  admin: Admin
  organizacion: {
    id: number
    nombre: string
    slug: string
  }
}

interface MeApiResponse {
  admin: Admin
}

class AuthApi implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await api.post<ApiResponse<LoginApiResponse>>(
      '/api/auth/login',
      credentials
    )

    const { token, admin, organizacion } = response.data.data

    // Guardar en localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('admin', JSON.stringify(admin))

    return {
      token,
      admin,
      organizacion: {
        ...organizacion,
        email: null,
        telefono: null,
        whatsapp: null,
        direccion: null,
        logo_url: null,
        descripcion: null,
        instagram: null,
        facebook: null,
        donacion_alias: null,
        donacion_cbu: null,
        donacion_info: null,
        activa: true
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    return !!token
  }

  async verifyToken(): Promise<Admin> {
    const response = await api.get<ApiResponse<MeApiResponse>>('/api/auth/me')
    return response.data.data.admin
  }

  async changePassword(passwordActual: string, passwordNueva: string): Promise<void> {
    await api.put('/api/auth/change-password', {
      password_actual: passwordActual,
      password_nueva: passwordNueva,
    })
  }
}

// Exportar instancia singleton
export const authApi = new AuthApi()

// También exportar la clase para testing
export { AuthApi }
