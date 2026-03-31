import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { Spinner } from '../ui'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Componente que protege rutas que requieren autenticación
 *
 * Comportamiento:
 * 1. Mientras carga (verificando token): muestra Spinner
 * 2. Si no está autenticado: redirige a login guardando la ruta actual
 * 3. Si está autenticado: muestra el contenido (children)
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Verificando sesión..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
