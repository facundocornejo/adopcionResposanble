import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/**
 * Layout para las páginas públicas
 * Incluye Header responsivo con menú hamburguesa y Footer
 */
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header con navegación */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PublicLayout
