/**
 * Axios Client Configuration
 * Cliente HTTP configurado con interceptores para auth y manejo de errores
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import toast from 'react-hot-toast'
import { config } from '../config/env'
import type { ApiError } from '@/domain/interfaces/common'

// Crear instancia de Axios con configuración base
const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================
// INTERCEPTOR DE REQUEST
// Se ejecuta ANTES de cada petición
// ============================================
api.interceptors.request.use(
  (axiosConfig: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('token')

    // Si hay token, agregarlo al header Authorization
    if (token && axiosConfig.headers) {
      axiosConfig.headers.Authorization = `Bearer ${token}`
    }

    return axiosConfig
  },
  (error: AxiosError) => {
    // Error antes de enviar la petición
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTOR DE RESPONSE
// Se ejecuta DESPUÉS de cada respuesta
// ============================================
api.interceptors.response.use(
  // Respuesta exitosa (2xx)
  (response: AxiosResponse) => {
    return response
  },

  // Error en la respuesta (4xx, 5xx, network error)
  (error: AxiosError<ApiError>) => {
    // Sin respuesta del servidor (network error, timeout, CORS)
    if (!error.response) {
      toast.error('Error de conexión. Verificá tu internet.')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    switch (status) {
      case 401:
        // Token inválido o expirado
        localStorage.removeItem('token')
        localStorage.removeItem('admin')

        // Solo mostrar toast si no estamos ya en login
        if (!window.location.pathname.includes('/login')) {
          toast.error('Sesión expirada. Por favor, ingresá de nuevo.')
          window.location.href = '/admin/login'
        }
        break

      case 403:
        // Sin permisos
        toast.error('No tenés permisos para realizar esta acción.')
        break

      case 404:
        // Recurso no encontrado
        // No mostramos toast genérico, dejamos que el componente lo maneje
        break

      case 409:
        // Conflicto (ej: solicitud duplicada)
        if (data?.error?.message) {
          toast.error(data.error.message)
        }
        break

      case 422:
        // Error de validación
        if (data?.error?.message) {
          toast.error(data.error.message)
        }
        break

      case 429:
        // Rate limit
        toast.error('Demasiadas solicitudes. Intentá más tarde.')
        break

      case 500:
        // Error del servidor
        toast.error('Error en el servidor. Intentá de nuevo más tarde.')
        break

      default:
        // Otros errores
        if (data?.error?.message) {
          toast.error(data.error.message)
        }
    }

    return Promise.reject(error)
  }
)

export default api
