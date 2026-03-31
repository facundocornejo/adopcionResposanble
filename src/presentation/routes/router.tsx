import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, Component, type ReactNode, type ErrorInfo } from 'react'

// Layout
import { PublicLayout, ProtectedRoute } from '../components/layout'
import { Spinner } from '../components/ui'

// Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error cargando página:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="text-center max-w-md animate-fadeIn">
            <div className="w-20 h-20 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😿</span>
            </div>
            <h1 className="text-2xl font-bold text-brown-800 mb-2">
              Error al cargar la página
            </h1>
            <p className="text-brown-600 mb-6">
              Hubo un problema cargando esta sección. Puede ser un problema de conexión.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors active:scale-[0.98]"
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Public pages - direct import (critical path)
import {
  Home,
  FAQ,
  Terminos,
  Nosotros,
  AnimalDetail,
  AdoptionForm,
  QuieroParticipar,
  CasosExito,
} from '../pages/public'

// Admin pages - lazy loaded (not critical path)
const Login = lazy(() => import('../pages/admin/Login'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const Animals = lazy(() => import('../pages/admin/Animals'))
const AnimalForm = lazy(() => import('../pages/admin/AnimalForm'))
const Requests = lazy(() => import('../pages/admin/Requests'))
const RequestDetail = lazy(() => import('../pages/admin/RequestDetail'))
const Settings = lazy(() => import('../pages/admin/Settings'))
const CasosExitoAdmin = lazy(() => import('../pages/admin/CasosExitoAdmin'))
const SuperAdminOrganizations = lazy(() => import('../pages/admin/SuperAdminOrganizations'))
const SuperAdminNewOrg = lazy(() => import('../pages/admin/SuperAdminNewOrg'))
const SuperAdminContactRequests = lazy(() => import('../pages/admin/SuperAdminContactRequests'))

// AdminLayout - lazy loaded
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'))

function PageLoader() {
  return <Spinner center text="Cargando..." />
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <ScrollToTop />
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/quiero-participar" element={<QuieroParticipar />} />
            <Route path="/casos-exito" element={<CasosExito />} />
            <Route path="/animal/:id" element={<AnimalDetail />} />
            <Route path="/animal/:id/adoptar" element={<AdoptionForm />} />
          </Route>

          {/* Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin - Protected + Lazy */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="animals" element={<Animals />} />
            <Route path="animals/new" element={<AnimalForm />} />
            <Route path="animals/:id/edit" element={<AnimalForm />} />
            <Route path="requests" element={<Requests />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="casos-exito" element={<CasosExitoAdmin />} />
            <Route path="settings" element={<Settings />} />
            <Route path="super/organizations" element={<SuperAdminOrganizations />} />
            <Route path="super/organizations/new" element={<SuperAdminNewOrg />} />
            <Route path="super/contact-requests" element={<SuperAdminContactRequests />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-cream flex items-center justify-center px-4">
                <div className="text-center animate-fadeIn">
                  <h1 className="text-7xl font-bold text-brown-200 mb-4">404</h1>
                  <p className="text-xl text-brown-700 mb-2">Página no encontrada</p>
                  <p className="text-brown-500 mb-8">La página que buscás no existe o fue movida.</p>
                  <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors active:scale-[0.98]"
                  >
                    Volver al inicio
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default AppRouter
