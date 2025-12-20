import { useContext } from 'react'
import { AuthContext } from '../context'

/**
 * Hook para acceder al contexto de autenticación
 * Provee acceso a:
 * - admin: datos del admin autenticado
 * - isAuthenticated: si hay sesión activa
 * - isLoading: si está verificando token
 * - login: función para iniciar sesión
 * - logout: función para cerrar sesión
 *
 * @example
 * const { admin, isAuthenticated, login, logout } = useAuth()
 *
 * if (isAuthenticated) {
 *   console.log('Hola', admin.nombre)
 * }
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}

export default useAuth
