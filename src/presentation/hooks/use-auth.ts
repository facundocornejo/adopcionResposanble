import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '../context/auth-context'

/**
 * Hook para acceder al contexto de autenticación
 *
 * @example
 * const { admin, isAuthenticated, login, logout } = useAuth()
 *
 * if (isAuthenticated) {
 *   console.log('Hola', admin?.nombre)
 * }
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}

export default useAuth
