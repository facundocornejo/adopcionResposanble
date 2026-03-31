import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  PawPrint,
  Inbox,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Building2,
  Users,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks'
import Logo from '../ui/Logo'

interface NavItem {
  path: string
  icon: LucideIcon
  label: string
  shortLabel?: string
  exact?: boolean
}

const navItems: NavItem[] = [
  { path: '/admin', icon: Home, label: 'Dashboard', shortLabel: 'Inicio', exact: true },
  { path: '/admin/animals', icon: PawPrint, label: 'Animales' },
  { path: '/admin/requests', icon: Inbox, label: 'Solicitudes' },
  { path: '/admin/casos-exito', icon: Heart, label: 'Casos de Éxito', shortLabel: 'Éxitos' },
  { path: '/admin/settings', icon: Settings, label: 'Configuración', shortLabel: 'Config.' },
]

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const superAdminItems: NavItem[] = admin?.es_super_admin
    ? [
        { path: '/admin/super/organizations', icon: Building2, label: 'Organizaciones' },
        {
          path: '/admin/super/contact-requests',
          icon: Users,
          label: 'Solicitudes Rescatistas',
        },
      ]
    : []

  const isActive = (item: NavItem): boolean => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:w-64 lg:h-full lg:bg-brown-900">
        {/* Logo */}
        <div className="p-6 border-b border-brown-700">
          <Logo size="lg" variant="light" to="/admin" />
          <p className="text-brown-400 text-sm mt-1">Panel de Administración</p>
        </div>

        {/* Info del admin */}
        <div className="px-6 py-4 border-b border-brown-700">
          <p className="text-white font-medium truncate">
            {admin?.nombre || 'Administrador'}
          </p>
          <p className="text-brown-400 text-sm truncate">{admin?.email || ''}</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive(item)
                  ? 'bg-terracotta-500 text-white'
                  : 'text-brown-300 hover:bg-brown-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Sección Super Admin */}
          {superAdminItems.length > 0 && (
            <>
              <div className="mt-6 mb-2 px-4">
                <p className="text-xs text-brown-500 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Super Admin
                </p>
              </div>
              {superAdminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(item)
                      ? 'bg-amber-500 text-white'
                      : 'text-brown-300 hover:bg-brown-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </>
          )}

          {/* Link al sitio público */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-brown-300 hover:bg-brown-800 hover:text-white transition-colors mt-4"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="font-medium">Ver sitio</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-brown-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-brown-300 hover:bg-brown-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Header Mobile */}
      <header className="lg:hidden bg-white border-b border-brown-100 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <Logo size="sm" to="/admin" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-brown-500">
              {admin?.es_super_admin ? 'SuperAdmin' : (admin?.nombre || 'Admin')}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-brown-700"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menú desplegable mobile */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-brown-200 shadow-lg">
            <div className="p-4 space-y-2">
              {/* Sección Super Admin */}
              {superAdminItems.length > 0 && (
                <>
                  <p className="text-xs text-brown-500 uppercase tracking-wider flex items-center gap-2 px-4 pt-2">
                    <Shield className="w-3 h-3" />
                    Super Admin
                  </p>
                  {superAdminItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive(item)
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-brown-700 hover:bg-brown-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="border-t border-brown-100 my-2" />
                </>
              )}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-brown-700 hover:bg-brown-50"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Ver sitio público</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <main className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brown-200 pb-safe z-40">
        <div className="flex justify-around py-1.5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1.5 px-1.5 min-w-0 ${
                isActive(item)
                  ? 'text-terracotta-500'
                  : 'text-brown-500 hover:text-terracotta-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 truncate max-w-full">{item.shortLabel || item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default AdminLayout
