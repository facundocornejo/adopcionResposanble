import { Link } from 'react-router-dom'
import { ArrowDown, Heart, Search, PawPrint, ClipboardList, PhoneCall, ArrowRight } from 'lucide-react'
import { useAnimals } from '../../hooks'
import { Alert } from '../../components/ui'
import { AnimalCard } from '../../components/animals'
import { AnimalFilters } from '../../components/animals'
import type { Animal } from '@/domain/entities/animal'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-fadeIn">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-2/3 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
      </div>
    </div>
  )
}

const steps = [
  {
    icon: Search,
    title: 'Elegí tu compañero',
    description: 'Navegá el catálogo y conocé la historia de cada animal.',
    color: 'bg-terracotta-100 text-terracotta-600',
  },
  {
    icon: ClipboardList,
    title: 'Completá el formulario',
    description: 'Contanos sobre vos para conocerte mejor.',
    color: 'bg-sage-100 text-sage-600',
  },
  {
    icon: PhoneCall,
    title: 'Te contactamos',
    description: 'Coordinamos una visita para que se conozcan.',
    color: 'bg-amber-100 text-amber-700',
  },
]

function Home() {
  const { animals, isLoading, error, filters, updateFilters, total } = useAnimals({})

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream via-warm-50 to-terracotta-50 py-16 md:py-24 lg:py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-terracotta-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-[15%] hidden lg:block">
          <PawPrint className="w-64 h-64 text-terracotta-500/[0.04] rotate-12" />
        </div>

        <div className="container-app relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-brown-600 mb-6 animate-fadeIn">
              <Heart className="w-4 h-4 text-terracotta-500" />
              {!isLoading && total > 0
                ? `${total} animales esperan por vos`
                : 'Adopción responsable en Paraná'}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brown-900 leading-[1.1] tracking-tight">
              Hay alguien
              <br />
              <span className="text-terracotta-500">esperando</span> por vos
            </h1>

            <p className="mt-5 text-lg md:text-xl text-brown-600 max-w-lg leading-relaxed">
              Encontrá a tu próximo compañero de vida. Cada adopción es una segunda oportunidad.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#animales"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-terracotta-500 text-white rounded-full font-medium hover:bg-terracotta-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-terracotta-500/25"
              >
                Conocelos
                <ArrowDown className="w-5 h-5" />
              </a>
              <Link
                to="/nosotros"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/80 backdrop-blur-sm text-brown-700 rounded-full font-medium hover:bg-white transition-all duration-200 border border-brown-200/50"
              >
                Sobre nosotros
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="animales" className="py-12 md:py-16">
        <div className="container-app">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900">
              Animales en adopción
            </h2>
          </div>

          {/* Filtros */}
          <AnimalFilters
            filters={filters}
            onFilterChange={updateFilters}
            totalResults={isLoading ? undefined : total}
            defaultFilters={{ estado: undefined }}
          />

          {/* Skeleton Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <Alert variant="error" title="Error al cargar">
              {error}
            </Alert>
          )}

          {/* Grid de animales */}
          {!isLoading && !error && animals.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal: Animal, index: number) => (
                <div
                  key={animal.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <AnimalCard animal={animal} />
                </div>
              ))}
            </div>
          )}

          {/* Estado vacío */}
          {!isLoading && !error && animals.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="w-10 h-10 text-brown-300" />
              </div>
              <h3 className="text-xl font-semibold text-brown-900">
                No encontramos animales
              </h3>
              <p className="text-brown-500 mt-2 max-w-md mx-auto">
                {filters.busqueda || filters.especie || filters.tamanio
                  ? 'Probá cambiando los filtros de búsqueda'
                  : 'Por ahora no hay animalitos disponibles, pero podés volver pronto'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4">
              ¿Cómo funciona la adopción?
            </h2>
            <p className="text-brown-600 text-lg">
              El proceso es simple y transparente. Queremos asegurarnos de que cada
              animal encuentre el hogar perfecto.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Connector line (hidden on mobile, visible on md+) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-brown-200" />
                )}

                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-7 h-7" />
                </div>

                <div className="text-xs font-bold text-brown-300 uppercase tracking-widest mb-2">
                  Paso {index + 1}
                </div>

                <h3 className="font-semibold text-brown-900 text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-brown-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-20">
        <div className="container-app">
          <div className="bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                ¿Querés ser parte del cambio?
              </h2>
              <p className="text-white/90 max-w-lg mx-auto mb-8 text-lg">
                Si sos rescatista o tenés un refugio, sumate a la plataforma y dale visibilidad a los animales que rescatás.
              </p>
              <Link
                to="/quiero-participar"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-terracotta-600 rounded-full font-semibold hover:bg-cream transition-colors"
              >
                Quiero participar
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
