import { Link } from 'react-router-dom'
import { Heart, Instagram, Facebook, Mail } from 'lucide-react'

/**
 * Footer del sitio público
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brown-900 text-white">
      {/* Contenido principal */}
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <Link to="/" className="text-2xl font-semibold">
              Adopta<span className="text-terracotta-500">.</span>
            </Link>
            <p className="mt-3 text-brown-300 text-sm leading-relaxed">
              Plataforma de adopción de animales.
              Conectamos rescatistas con familias que buscan un compañero de vida.
            </p>

            {/* Redes sociales */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brown-400 hover:text-terracotta-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brown-400 hover:text-terracotta-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:contacto@adopta.com"
                className="text-brown-400 hover:text-terracotta-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-brown-300 hover:text-white transition-colors text-sm"
                >
                  Ver animales
                </Link>
              </li>
              <li>
                <Link
                  to="/nosotros"
                  className="text-brown-300 hover:text-white transition-colors text-sm"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-brown-300 hover:text-white transition-colors text-sm"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-brown-300 hover:text-white transition-colors text-sm"
                >
                  Soy rescatista
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-brown-300">
              <li>Paraná, Entre Ríos</li>
              <li>Argentina</li>
              <li>
                <a
                  href="mailto:contacto@adopta.com"
                  className="hover:text-white transition-colors"
                >
                  contacto@adopta.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-brown-800">
        <div className="container-app py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brown-400">
            <p>
              © {currentYear} Adopción Responsable. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/terminos" className="hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
              <span className="text-brown-600">|</span>
              <p className="flex items-center gap-1">
                Hecho con <Heart className="w-4 h-4 text-terracotta-500" /> para los animales
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
