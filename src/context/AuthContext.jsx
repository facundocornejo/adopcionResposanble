import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services'

/**
 * Contexto de Autenticación
 * Provee estado global de auth a toda la aplicación
 */
export const AuthContext = createContext(null)

/**
 * Provider de Autenticación
 * Envuelve la app y maneja:
 * - Estado de usuario autenticado
 * - Login / Logout
 * - Verificación inicial del token
 */
export const AuthProvider = ({ children }) => {
  // Estado del admin autenticado
  const [admin, setAdmin] = useState(null)
  // Estado de carga inicial (verificando token)
  const [isLoading, setIsLoading] = useState(true)
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /**
   * Verificar si hay sesión guardada al cargar la app
   * Intenta recuperar el admin del localStorage
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken()

        if (token) {
          // Hay token guardado, intentar verificar con el backend
          try {
            const adminData = await authService.verifyToken()
            setAdmin(adminData)
            setIsAuthenticated(true)
          } catch {
            // Token inválido o expirado, limpiar
            authService.logout()
            setAdmin(null)
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Error al inicializar auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * Iniciar sesión
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} - Datos del admin
   */
  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password)
    setAdmin(data.admin)
    setIsAuthenticated(true)
    return data
  }, [])

  /**
   * Cerrar sesión
   */
  const logout = useCallback(() => {
    authService.logout()
    setAdmin(null)
    setIsAuthenticated(false)
  }, [])

  // Valor del contexto
  const value = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
