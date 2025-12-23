import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'

// Layout
import PublicLayout from './components/layout/PublicLayout'
import { ProtectedRoute } from './components/layout'
import { Spinner } from './components/ui'

// Páginas públicas (carga directa - son las principales)
import Home from './pages/public/Home'

// Páginas públicas con lazy loading
const AnimalDetail = lazy(() => import('./pages/public/AnimalDetail'))
const AdoptionForm = lazy(() => import('./pages/public/AdoptionForm'))
const Nosotros = lazy(() => import('./pages/public/Nosotros'))
const FAQ = lazy(() => import('./pages/public/FAQ'))
const Terminos = lazy(() => import('./pages/public/Terminos'))
const QuieroParticipar = lazy(() => import('./pages/public/QuieroParticipar'))
const CasosExito = lazy(() => import('./pages/public/CasosExito'))

// Páginas admin con lazy loading (se cargan solo cuando se necesitan)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Animals = lazy(() => import('./pages/admin/Animals'))
const AnimalForm = lazy(() => import('./pages/admin/AnimalForm'))
const Requests = lazy(() => import('./pages/admin/Requests'))
const RequestDetail = lazy(() => import('./pages/admin/RequestDetail'))
const Settings = lazy(() => import('./pages/admin/Settings'))

// Páginas super-admin
const SuperAdminOrganizations = lazy(() => import('./pages/admin/SuperAdminOrganizations'))
const SuperAdminNewOrg = lazy(() => import('./pages/admin/SuperAdminNewOrg'))
const SuperAdminContactRequests = lazy(() => import('./pages/admin/SuperAdminContactRequests'))

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
  )
}

export default AppRouter
