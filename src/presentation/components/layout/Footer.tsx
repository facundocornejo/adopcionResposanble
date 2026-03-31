import { Link } from 'react-router-dom'
import { Heart, Mail, Github, Code } from 'lucide-react'
import { FaInstagram, FaFacebookF } from 'react-icons/fa'
import Logo from '../ui/Logo'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative">
      {/* Curved divider */}
      <div className="bg-cream">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-12"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V20C240 0 480 0 720 20C960 40 1200 40 1440 20V60H0Z"
            fill="#3D2E22"
          />
        </svg>
      </div>

      <div className="bg-brown-900 text-white">
        {/* Contenido principal */}
        <div className="container-app py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo y descripción */}
            <div>
              <Logo size="lg" variant="light" />
              <p className="mt-3 text-brown-300 text-sm leading-relaxed">
                Plataforma de adopción de animales. Conectamos rescatistas con familias
                que buscan un compañero de vida.
              </p>

              {/* Redes sociales */}
              <div className="flex gap-3 mt-5">
                {[
                  { href: 'https://instagram.com', icon: FaInstagram, label: 'Instagram' },
                  { href: 'https://facebook.com', icon: FaFacebookF, label: 'Facebook' },
                  { href: 'mailto:proyectoperritos@hotmail.com', icon: Mail, label: 'Email' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-brown-800 text-brown-400 hover:bg-terracotta-500 hover:text-white transition-all duration-200 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links rápidos */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-brown-400">Enlaces</h4>
              <ul className="space-y-2.5">
                {[
                  { to: '/', label: 'Ver animales' },
                  { to: '/casos-exito', label: 'Casos de éxito' },
                  { to: '/nosotros', label: 'Sobre nosotros' },
                  { to: '/faq', label: 'Preguntas frecuentes' },
                  { to: '/quiero-participar', label: 'Quiero ser rescatista' },
                  { to: '/admin/login', label: 'Iniciar sesión' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-brown-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-brown-400">Contacto</h4>
              <ul className="space-y-2.5 text-sm text-brown-300">
                <li>Paraná, Entre Ríos</li>
                <li>Argentina</li>
                <li>
                  <a
                    href="mailto:proyectoperritos@hotmail.com"
                    className="hover:text-white transition-colors"
                  >
                    proyectoperritos@hotmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-brown-800">
          <div className="container-app py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-brown-400 text-center">
              <p>© {currentYear} Adopta. Todos los derechos reservados.</p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <Link to="/terminos" className="hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
                <span className="hidden sm:inline text-brown-700">|</span>
                <p className="flex items-center gap-1">
                  Hecho con <Heart className="w-4 h-4 text-terracotta-500 fill-terracotta-500" /> para los animales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Crédito del desarrollador */}
        <div className="bg-brown-950">
          <div className="container-app py-3">
            <div className="flex justify-center items-center gap-2 text-xs text-brown-500">
              <Code className="w-3.5 h-3.5" />
              <span>Desarrollado por</span>
              <span className="text-brown-400 font-medium">Facundo Cornejo</span>
              <a
                href="https://github.com/facundocornejo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brown-500 hover:text-white transition-colors ml-1"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
