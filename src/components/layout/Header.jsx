import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react'
import { clsx } from 'clsx'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks'

/**
 * Header responsivo para el sitio público
 * - Desktop: navegación horizontal
 * - Mobile: menú hamburguesa con panel deslizable
 * - Muestra opciones según estado de autenticación
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, admin, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Animales' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/faq', label: 'FAQ' },
    { path: '/nosotros#contacto', label: 'Contáctanos' },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    toast.success('Sesión cerrada')
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-brown-100 sticky top-0 z-50">
      <div className="container-app">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-semibold text-brown-900"
            onClick={closeMenu}
          >
            Adopta<span className="text-terracotta-500">.</span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'text-base font-medium transition-colors duration-200',
                  isActive(item.path)
                    ? 'text-terracotta-500'
                    : 'text-brown-600 hover:text-brown-900'
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Opciones de autenticación */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Info del admin */}
                <span className="text-sm text-brown-500 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {admin?.nombre || 'Admin'}
                </span>

                {/* Link al panel */}
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-lg text-sm font-medium hover:bg-terracotta-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Panel
                </Link>

                {/* Botón logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-brown-500 hover:text-brown-700 hover:bg-brown-50 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="px-4 py-2 bg-brown-900 text-white rounded-lg text-sm font-medium hover:bg-brown-700 transition-colors"
              >
                Ingresar
              </Link>
            )}
          </div>

          {/* Botón Hamburguesa - Solo móvil */}
          <button
            className="md:hidden p-2 -mr-2 text-brown-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Menú Móvil */}
        <div
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <nav className="border-t border-brown-100 pt-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={clsx(
                    'py-3 px-2 rounded-lg font-medium transition-colors',
                    isActive(item.path)
                      ? 'text-terracotta-500 bg-terracotta-50'
                      : 'text-brown-700 hover:bg-warm-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-brown-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    {/* Info del admin */}
                    <div className="px-2 py-2 text-sm text-brown-500 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{admin?.nombre || 'Administrador'}</span>
                    </div>

                    {/* Link al panel */}
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Panel de Administración
                    </Link>

                    {/* Botón logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-3 border border-brown-200 text-brown-700 rounded-xl font-medium hover:bg-brown-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={closeMenu}
                    className="block w-full py-3 bg-brown-900 text-white text-center rounded-xl font-medium hover:bg-brown-700 transition-colors"
                  >
                    Ingresar
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
