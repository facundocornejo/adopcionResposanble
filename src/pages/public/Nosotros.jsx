import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Heart, Users, Home, Shield, Handshake, PawPrint } from 'lucide-react'

/**
 * Página "Nosotros" - Información sobre la plataforma
 */
const Nosotros = () => {
  const location = useLocation()

  // Scroll a la sección si hay un hash en la URL
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  const valores = [
    {
      icon: Handshake,
      titulo: 'Conexión directa',
      descripcion: 'Conectamos rescatistas y refugios con familias que buscan adoptar de manera responsable.'
    },
    {
      icon: Shield,
      titulo: 'Adopción responsable',
      descripcion: 'Facilitamos un proceso de adopción transparente que prioriza el bienestar animal.'
    },
    {
      icon: Users,
      titulo: 'Comunidad solidaria',
      descripcion: 'Unimos a rescatistas, voluntarios y familias comprometidas con la causa animal.'
    },
    {
      icon: Heart,
      titulo: 'Segundas oportunidades',
      descripcion: 'Cada animal merece un hogar lleno de amor. Ayudamos a que eso sea posible.'
    }
  ]

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white py-16 md:py-24">
        <div className="container-app text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Adopción Responsable
          </h1>
          <p className="text-lg md:text-xl text-terracotta-100 max-w-2xl mx-auto">
            Una plataforma que conecta rescatistas y refugios con familias
            que buscan darle un hogar a un animal en situación de calle.
          </p>
        </div>
      </section>

      {/* Qué somos */}
      <section className="py-12 md:py-16">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-6">
              ¿Qué es esta plataforma?
            </h2>
            <p className="text-brown-600 text-lg leading-relaxed mb-4">
              <span className="font-semibold text-terracotta-500">Adopción Responsable</span> es
              una plataforma gratuita que facilita la conexión entre quienes rescatan animales
              de la calle y las familias que desean adoptar.
            </p>
            <p className="text-brown-600 text-lg leading-relaxed">
              Nuestro objetivo es simplificar el proceso de adopción, brindando visibilidad
              a los animales que buscan hogar y permitiendo que los rescatistas gestionen
              las solicitudes de manera organizada.
            </p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-app">
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 text-center mb-10">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Para rescatistas */}
            <div className="bg-sage-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-sage-500 text-white rounded-full flex items-center justify-center mb-4">
                <PawPrint className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brown-900 mb-3">
                Para Rescatistas y Refugios
              </h3>
              <ul className="space-y-2 text-brown-600">
                <li className="flex items-start gap-2">
                  <span className="text-sage-500 mt-1">•</span>
                  Publicá los animales que tenés en adopción
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-500 mt-1">•</span>
                  Recibí solicitudes de adopción organizadas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-500 mt-1">•</span>
                  Evaluá a los posibles adoptantes desde un panel
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-500 mt-1">•</span>
                  Contactá directamente por WhatsApp o email
                </li>
              </ul>
            </div>

            {/* Para adoptantes */}
            <div className="bg-terracotta-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-terracotta-500 text-white rounded-full flex items-center justify-center mb-4">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brown-900 mb-3">
                Para Familias Adoptantes
              </h3>
              <ul className="space-y-2 text-brown-600">
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-500 mt-1">•</span>
                  Explorá animales disponibles para adopción
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-500 mt-1">•</span>
                  Filtrá por especie, tamaño y características
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-500 mt-1">•</span>
                  Completá el formulario de adopción online
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-500 mt-1">•</span>
                  El rescatista te contactará para coordinar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-12 md:py-16">
        <div className="container-app">
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 text-center mb-10">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow border border-brown-100"
              >
                <div className="w-14 h-14 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <valor.icon className="w-7 h-7 text-terracotta-500" />
                </div>
                <h3 className="font-semibold text-brown-900 mb-2">
                  {valor.titulo}
                </h3>
                <p className="text-brown-600 text-sm">
                  {valor.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Adopción */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-app">
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 text-center mb-10">
            Proceso de Adopción
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { paso: '1', titulo: 'Elegí tu compañero', desc: 'Explorá los animales disponibles y encontrá el que mejor se adapte a tu familia.' },
                { paso: '2', titulo: 'Completá el formulario', desc: 'Respondé algunas preguntas para que el rescatista pueda conocerte mejor.' },
                { paso: '3', titulo: 'Coordiná la adopción', desc: 'El rescatista te contactará para coordinar una visita y conocer al animal.' }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-warm-50 rounded-2xl p-6 border border-brown-100">
                    <div className="w-10 h-10 bg-terracotta-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                      {item.paso}
                    </div>
                    <h3 className="font-semibold text-brown-900 mb-2">
                      {item.titulo}
                    </h3>
                    <p className="text-brown-600 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Contáctanos */}
      <section id="contacto" className="py-12 md:py-16 bg-brown-900 text-white">
        <div className="container-app">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            ¿Cómo podemos ayudarte?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Opción para adoptar */}
            <div className="bg-brown-800 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Quiero adoptar
              </h3>
              <p className="text-brown-300 text-sm mb-4">
                Explorá los animales disponibles y encontrá a tu próximo compañero de vida.
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
              >
                Ver animales en adopción
              </Link>
            </div>

            {/* Opción para rescatistas */}
            <div className="bg-brown-800 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Soy rescatista
              </h3>
              <p className="text-brown-300 text-sm mb-4">
                ¿Tenés un refugio o rescatás animales? Unite a la plataforma y llegá a más adoptantes.
              </p>
              <Link
                to="/quiero-participar"
                className="inline-block px-6 py-3 bg-sage-500 text-white rounded-xl font-medium hover:bg-sage-600 transition-colors"
              >
                Quiero participar
              </Link>
            </div>
          </div>

          {/* Email de contacto */}
          <p className="text-center text-brown-400 text-sm mt-8">
            ¿Tenés otra consulta? Escribinos a{' '}
            <a href="mailto:proyectoperritos@hotmail.com" className="text-terracotta-400 hover:text-terracotta-300">
              proyectoperritos@hotmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Nosotros
