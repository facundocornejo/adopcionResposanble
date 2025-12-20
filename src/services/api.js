import axios from 'axios'
import toast from 'react-hot-toast'

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://adopcion-api.onrender.com',
  timeout: 15000, // 15 segundos (Render free tier puede ser lento)
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================
// INTERCEPTOR DE REQUEST
// Se ejecuta ANTES de cada petición
// ============================================
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('token')

    // Si hay token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
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
  (response) => {
    return response
  },

  // Error en la respuesta (4xx, 5xx, network error)
  (error) => {
    // Sin respuesta del servidor (network error, timeout, CORS)
    if (!error.response) {
      toast.error('Error de conexión. Verificá tu internet.')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    switch (status) {
      case 401:
        // Token inválido o expirado
        // Limpiar sesión y redirigir a login
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

      case 422:
        // Error de validación
        // El mensaje viene del backend
        if (data?.message) {
          toast.error(data.message)
        }
        break

      case 500:
        // Error del servidor
        toast.error('Error en el servidor. Intentá de nuevo más tarde.')
        break

      default:
        // Otros errores
        if (data?.message) {
          toast.error(data.message)
        }
    }

    return Promise.reject(error)
  }
)

export default api
