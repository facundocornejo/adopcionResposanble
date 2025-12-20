import { ArrowDown } from 'lucide-react'
import { useAnimals } from '../../hooks'
import { AnimalCard, AnimalFilters } from '../../components/animals'
import { Spinner, Alert } from '../../components/ui'

/**
 * Página Home - Catálogo de animales
 * Hero emocional + filtros + grid de cards
 */
const Home = () => {
  const {
    animals,
    isLoading,
    error,
    filters,
    updateFilters,
    total,
  } = useAnimals({ estado: 'Disponible' }) // Por defecto solo disponibles

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-12 md:py-20 lg:py-24">
        <div className="container-app">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brown-900 leading-tight">
              Hay alguien esperando por vos
            </h1>
            <p className="mt-4 text-lg md:text-xl text-brown-600">
              Encontrá a tu próximo compañero de vida.
              Todos merecen un hogar.
            </p>
            <div className="mt-8">
              <a
                href="#animales"
                className="inline-flex items-center px-6 py-3 bg-terracotta-500 text-white rounded-xl font-medium hover:bg-terracotta-600 active:bg-terracotta-700 transition-colors"
              >
                Conocelos
                <ArrowDown className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="animales" className="py-12 md:py-16">
        <div className="container-app">
          <h2 className="text-2xl font-semibold text-brown-900 mb-6">
            Animales en adopción
          </h2>

          {/* Filtros */}
          <AnimalFilters
            filters={filters}
            onFilterChange={updateFilters}
            totalResults={!isLoading ? total : undefined}
          />

          {/* Estado de carga */}
          {isLoading && (
            <Spinner center text="Cargando animales..." />
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
              {animals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          )}

          {/* Estado vacío */}
          {!isLoading && !error && animals.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-brown-900">
                No encontramos animales
              </h3>
              <p className="text-brown-500 mt-2 max-w-md mx-auto">
                {filters.busqueda || filters.especie || filters.tamanio
                  ? 'Probá cambiando los filtros de búsqueda'
                  : 'Por ahora no hay animalitos disponibles, pero podés volver pronto'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sección informativa */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4">
              ¿Cómo funciona la adopción?
            </h2>
            <p className="text-brown-600 mb-8">
              El proceso es simple y transparente. Queremos asegurarnos de que cada
              animal encuentre el hogar perfecto.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {/* Paso 1 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-terracotta-600">1</span>
                </div>
                <h3 className="font-semibold text-brown-900 mb-2">
                  Elegí tu compañero
                </h3>
                <p className="text-sm text-brown-500">
                  Navegá el catálogo y conocé la historia de cada animal.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-terracotta-600">2</span>
                </div>
                <h3 className="font-semibold text-brown-900 mb-2">
                  Completá el formulario
                </h3>
                <p className="text-sm text-brown-500">
                  Contanos sobre vos para conocerte mejor.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-terracotta-600">3</span>
                </div>
                <h3 className="font-semibold text-brown-900 mb-2">
                  Te contactamos
                </h3>
                <p className="text-sm text-brown-500">
                  Coordinamos una visita para que se conozcan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
