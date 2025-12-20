import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { Spinner } from '../ui'

/**
 * Componente que protege rutas que requieren autenticación
 * Usa el AuthContext para verificar el estado de autenticación
 *
 * Comportamiento:
 * 1. Mientras carga (verificando token): muestra Spinner
 * 2. Si no está autenticado: redirige a login guardando la ruta actual
 * 3. Si está autenticado: muestra el contenido (children)
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  // Mientras verifica el token, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Verificando sesión..." />
      </div>
    )
  }

  // Si no está autenticado, redirigir a login
  // Guardamos la ubicación actual para redirigir después del login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // Si está autenticado, mostrar el contenido
  return children
}

export default ProtectedRoute
