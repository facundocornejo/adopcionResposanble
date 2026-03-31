import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, User, Heart } from 'lucide-react'
import { clsx } from 'clsx'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks'
import Logo from '../ui/Logo'

interface NavItem {
  path: string
  label: string
}

const navItems: NavItem[] = [
  { path: '/', label: 'Animales' },
  { path: '/casos-exito', label: 'Casos de éxito' },
  { path: '/nosotros', label: 'Nosotros' },
  { path: '/faq', label: 'FAQ' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, admin, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/'
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
    <>
      <header
        className={clsx(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-brown-100/50'
            : 'bg-white border-b border-brown-100'
        )}
      >
        <div className="container-app">
          <nav className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <Logo size="md" onClick={closeMenu} />

            {/* Navegación Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={clsx(
                    'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all after:duration-200',
                    isActive(item.path)
                      ? 'text-terracotta-500 after:bg-terracotta-500 after:scale-x-100'
                      : 'text-brown-600 hover:text-brown-900 hover:bg-brown-50 after:bg-terracotta-500 after:scale-x-0 hover:after:scale-x-100'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="w-px h-6 bg-brown-200 mx-2" />

              {/* CTA Adoptar */}
              <Link
                to="/"
                className="flex items-center gap-1.5 px-4 py-2 bg-terracotta-500 text-white rounded-full text-sm font-medium hover:bg-terracotta-600 transition-all duration-200 hover:shadow-md"
              >
                <Heart className="w-4 h-4" />
                Adoptar
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-sm text-brown-500 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {admin?.nombre || 'Admin'}
                  </span>

                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 bg-brown-900 text-white rounded-lg text-sm font-medium hover:bg-brown-700 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Panel
                  </Link>

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
                  className="ml-2 px-4 py-2 border border-brown-200 text-brown-700 rounded-lg text-sm font-medium hover:bg-brown-50 transition-colors"
                >
                  Ingresar
                </Link>
              )}
            </div>

            {/* Botón Hamburguesa - Solo móvil */}
            <button
              className="md:hidden p-2 -mr-2 text-brown-900 rounded-lg hover:bg-brown-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Overlay móvil */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300',
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMenu}
      />

      {/* Menú Móvil - Slide down */}
      <div
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ease-out',
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="bg-white shadow-xl rounded-b-2xl">
          {/* Header del menú */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-brown-100">
            <Logo size="md" onClick={closeMenu} />
            <button
              onClick={closeMenu}
              className="p-2 text-brown-700 hover:bg-brown-50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={clsx(
                    'py-3 px-4 rounded-xl font-medium transition-colors',
                    isActive(item.path)
                      ? 'text-terracotta-500 bg-terracotta-500/10'
                      : 'text-brown-700 hover:bg-brown-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* CTA Adoptar Mobile */}
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 mt-2 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                Adoptar ahora
              </Link>

              <div className="pt-3 mt-3 border-t border-brown-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-brown-500 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{admin?.nombre || 'Administrador'}</span>
                    </div>

                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-brown-900 text-white rounded-xl font-medium hover:bg-brown-700 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Panel de Administración
                    </Link>

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
                    className="block w-full py-3 border border-brown-200 text-brown-700 text-center rounded-xl font-medium hover:bg-brown-50 transition-colors"
                  >
                    Ingresar
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header
