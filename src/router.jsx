import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, Component } from 'react'

// Layout
import PublicLayout from './components/layout/PublicLayout'
import { ProtectedRoute } from './components/layout'
import { Spinner } from './components/ui'

// Función helper para lazy loading con retry automático
const lazyWithRetry = (componentImport) => {
  return lazy(async () => {
    const maxRetries = 3
    let lastError

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await componentImport()
      } catch (error) {
        lastError = error
        // Esperar antes de reintentar (incrementando el tiempo)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }

    throw lastError
  })
}

// Error Boundary para capturar errores de carga de chunks
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
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
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😿</div>
            <h1 className="text-2xl font-bold text-brown-800 mb-2">
              Error al cargar la página
            </h1>
            <p className="text-brown-600 mb-6">
              Hubo un problema cargando esta sección. Puede ser un problema de conexión.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
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

// Páginas públicas (carga directa - son las principales)
import Home from './pages/public/Home'

// Páginas públicas con lazy loading y retry
const AnimalDetail = lazyWithRetry(() => import('./pages/public/AnimalDetail'))
const AdoptionForm = lazyWithRetry(() => import('./pages/public/AdoptionForm'))
const Nosotros = lazyWithRetry(() => import('./pages/public/Nosotros'))
const FAQ = lazyWithRetry(() => import('./pages/public/FAQ'))
const Terminos = lazyWithRetry(() => import('./pages/public/Terminos'))
const QuieroParticipar = lazyWithRetry(() => import('./pages/public/QuieroParticipar'))
const CasosExito = lazyWithRetry(() => import('./pages/public/CasosExito'))

// Páginas admin con lazy loading y retry
const AdminLayout = lazyWithRetry(() => import('./components/layout/AdminLayout'))
const Login = lazyWithRetry(() => import('./pages/admin/Login'))
const Dashboard = lazyWithRetry(() => import('./pages/admin/Dashboard'))
const Animals = lazyWithRetry(() => import('./pages/admin/Animals'))
const AnimalForm = lazyWithRetry(() => import('./pages/admin/AnimalForm'))
const Requests = lazyWithRetry(() => import('./pages/admin/Requests'))
const RequestDetail = lazyWithRetry(() => import('./pages/admin/RequestDetail'))
const Settings = lazyWithRetry(() => import('./pages/admin/Settings'))

// Páginas super-admin
const SuperAdminOrganizations = lazyWithRetry(() => import('./pages/admin/SuperAdminOrganizations'))
const SuperAdminNewOrg = lazyWithRetry(() => import('./pages/admin/SuperAdminNewOrg'))
const SuperAdminContactRequests = lazyWithRetry(() => import('./pages/admin/SuperAdminContactRequests'))

// Componente de loading mientras cargan las páginas lazy
const PageLoader = () => (
  <Spinner center text="Cargando..." />
)

// Componente para hacer scroll al top en cada cambio de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const AppRouter = () => {
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

        {/* Login - No requiere autenticación */}
        <Route path="/admin/login" element={<Login />} />

        {/* Rutas de admin - Protegidas */}
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
          <Route path="settings" element={<Settings />} />
          {/* Rutas super-admin */}
          <Route path="super/organizations" element={<SuperAdminOrganizations />} />
          <Route path="super/organizations/new" element={<SuperAdminNewOrg />} />
          <Route path="super/contact-requests" element={<SuperAdminContactRequests />} />
        </Route>

        {/* 404 - Página no encontrada */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-cream flex items-center justify-center px-4">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-brown-300 mb-4">404</h1>
                <p className="text-xl text-brown-700 mb-6">Página no encontrada</p>
                <a
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
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
