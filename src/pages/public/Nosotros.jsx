import { Heart, Users, Home, Shield } from 'lucide-react'

/**
 * Página "Nosotros" - Información sobre el refugio
 */
const Nosotros = () => {
  const valores = [
    {
      icon: Heart,
      titulo: 'Amor por los animales',
      descripcion: 'Cada animal merece una segunda oportunidad y un hogar lleno de amor.'
    },
    {
      icon: Shield,
      titulo: 'Adopción responsable',
      descripcion: 'Evaluamos cada solicitud para asegurar el bienestar del animal y la familia.'
    },
    {
      icon: Users,
      titulo: 'Comunidad',
      descripcion: 'Trabajamos junto a voluntarios y familias comprometidas con la causa.'
    },
    {
      icon: Home,
      titulo: 'Hogares felices',
      descripcion: 'Nuestro objetivo es encontrar el hogar perfecto para cada animal.'
    }
  ]

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white py-16 md:py-24">
        <div className="container-app text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg md:text-xl text-terracotta-100 max-w-2xl mx-auto">
            Somos un refugio dedicado a rescatar, rehabilitar y encontrar hogares
            amorosos para animales abandonados.
          </p>
        </div>
      </section>

      {/* Misión */}
      <section className="py-12 md:py-16">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-6">
              Nuestra Misión
            </h2>
            <p className="text-brown-600 text-lg leading-relaxed">
              En <span className="font-semibold text-terracotta-500">Refugio Patitas Felices</span>,
              creemos que cada animal merece una vida digna. Desde 2015, hemos rescatado y
              rehabilitado a cientos de perros y gatos que fueron abandonados o maltratados,
              brindándoles atención veterinaria, amor y la oportunidad de encontrar una familia
              que los adopte de manera responsable.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-app">
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 text-center mb-10">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor, index) => (
              <div
                key={index}
                className="bg-warm-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
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
      <section className="py-12 md:py-16">
        <div className="container-app">
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 text-center mb-10">
            Proceso de Adopción
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { paso: '1', titulo: 'Elegí tu compañero', desc: 'Explorá los animales disponibles y encontrá el que mejor se adapte a tu familia.' },
                { paso: '2', titulo: 'Completá el formulario', desc: 'Respondé algunas preguntas para que podamos conocerte mejor.' },
                { paso: '3', titulo: 'Conocé al animal', desc: 'Coordinamos una visita para que se conozcan antes de la adopción.' }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-brown-100">
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

      {/* Contacto */}
      <section className="py-12 md:py-16 bg-brown-900 text-white">
        <div className="container-app text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Querés ayudar?
          </h2>
          <p className="text-brown-300 mb-6 max-w-xl mx-auto">
            Podés colaborar como voluntario, haciendo donaciones o simplemente
            compartiendo nuestras publicaciones para dar visibilidad a los animales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contacto@patitasfelices.org"
              className="px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 transition-colors"
            >
              Contactanos
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-white text-brown-900 rounded-xl font-medium hover:bg-brown-50 transition-colors"
            >
              Ver animales
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Nosotros
