import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Admin } from '@/domain/entities/admin'
import { authApi } from '@/infrastructure/api/auth-api'

// Admin with optional organization info (from login response)
export interface AdminWithOrg extends Admin {
  organizacion?: {
    id: number
    nombre: string
    slug: string
  }
}

export interface AuthContextValue {
  admin: AdminWithOrg | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ admin: Admin; token: string }>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [admin, setAdmin] = useState<AdminWithOrg | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authApi.getToken()

        if (token) {
          try {
            const adminData = await authApi.verifyToken()
            // Try to get org data from stored login session
            const storedAdmin = localStorage.getItem('admin')
            let adminWithOrg: AdminWithOrg = adminData
            if (storedAdmin) {
              try {
                const parsed = JSON.parse(storedAdmin)
                if (parsed.organizacion) {
                  adminWithOrg = { ...adminData, organizacion: parsed.organizacion }
                }
              } catch {
                // Ignore parse errors
              }
            }
            setAdmin(adminWithOrg)
            setIsAuthenticated(true)
          } catch {
            authApi.logout()
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

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password })
    const adminWithOrg: AdminWithOrg = {
      ...data.admin,
      organizacion: data.organizacion
    }
    // Store with org data
    localStorage.setItem('admin', JSON.stringify(adminWithOrg))
    setAdmin(adminWithOrg)
    setIsAuthenticated(true)
    return data
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setAdmin(null)
    setIsAuthenticated(false)
  }, [])

  const value: AuthContextValue = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
