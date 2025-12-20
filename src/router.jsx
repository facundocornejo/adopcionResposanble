import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layout
import PublicLayout from './components/layout/PublicLayout'
import { ProtectedRoute } from './components/layout'
import { Spinner } from './components/ui'

// Páginas públicas (carga directa - son las principales)
import Home from './pages/public/Home'

// Páginas públicas con lazy loading
const AnimalDetail = lazy(() => import('./pages/public/AnimalDetail'))
const AdoptionForm = lazy(() => import('./pages/public/AdoptionForm'))

// Páginas admin con lazy loading (se cargan solo cuando se necesitan)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Animals = lazy(() => import('./pages/admin/Animals'))
const AnimalForm = lazy(() => import('./pages/admin/AnimalForm'))
const Requests = lazy(() => import('./pages/admin/Requests'))
const RequestDetail = lazy(() => import('./pages/admin/RequestDetail'))

// Componente de loading mientras cargan las páginas lazy
const PageLoader = () => (
  <Spinner center text="Cargando..." />
)

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
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
