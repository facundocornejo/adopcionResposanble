import { useState, useEffect } from 'react'
import { Heart, Search, Building2, Loader2 } from 'lucide-react'
import CasoExitoCard from '../../components/casosexito/CasoExitoCard'
import api from '../../services/api'

/**
 * Página pública de Casos de Éxito
 * Muestra animales adoptados agrupados por organización
 */
const CasosExito = () => {
  const [organizaciones, setOrganizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCasosExito()
  }, [])

  const fetchCasosExito = async () => {
    try {
      setLoading(true)
      const response = await api.get('/casos-exito')

      if (response.data.success) {
        setOrganizaciones(response.data.data.organizaciones || [])
      }
    } catch (err) {
      console.error('Error fetching casos de éxito:', err)
      setError('Error al cargar los casos de éxito')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por búsqueda
  const filteredOrgs = organizaciones.filter(org => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()

    // Buscar en nombre de org o en casos
    const orgMatch = org.nombre.toLowerCase().includes(search)
    const casosMatch = org.casosExito?.some(caso =>
      caso.titulo.toLowerCase().includes(search) ||
      caso.animal?.nombre?.toLowerCase().includes(search)
    )

    return orgMatch || casosMatch
  })

  // Contar total de casos
  const totalCasos = organizaciones.reduce(
    (acc, org) => acc + (org.casosExito?.length || 0),
    0
  )

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-sm font-medium">Finales felices</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Casos de Éxito
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Conocé las historias de animales que encontraron su hogar para siempre.
              Cada adopción es un final feliz que nos llena de alegría.
            </p>

            {/* Estadística */}
            {totalCasos > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-xl">
                <Heart className="w-6 h-6 fill-current" />
                <span className="text-2xl font-bold">{totalCasos}</span>
                <span className="text-purple-100">
                  {totalCasos === 1 ? 'adopción exitosa' : 'adopciones exitosas'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-12">
        <div className="container-app">
          {/* Barra de búsqueda */}
          {totalCasos > 0 && (
            <div className="max-w-md mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, organización..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-brown-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchCasosExito}
                className="mt-4 text-purple-600 hover:underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Sin casos */}
          {!loading && !error && totalCasos === 0 && (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-brown-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-brown-700 mb-2">
                Todavía no hay casos de éxito
              </h2>
              <p className="text-brown-500">
                Pronto compartiremos las historias de nuestras adopciones exitosas.
              </p>
            </div>
          )}

          {/* Sin resultados de búsqueda */}
          {!loading && !error && totalCasos > 0 && filteredOrgs.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-brown-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-brown-700 mb-2">
                Sin resultados
              </h2>
              <p className="text-brown-500">
                No encontramos casos que coincidan con tu búsqueda.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-purple-600 hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}

          {/* Casos por organización */}
          {!loading && !error && filteredOrgs.map((org) => (
            <div key={org.id} className="mb-12">
              {/* Header de la organización */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brown-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-brown-800">
                    {org.nombre}
                  </h2>
                  <p className="text-sm text-brown-500">
                    {org.casosExito?.length || 0} {org.casosExito?.length === 1 ? 'caso' : 'casos'} de éxito
                  </p>
                </div>
              </div>

              {/* Grid de casos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {org.casosExito?.map((caso) => (
                  <CasoExitoCard key={caso.id} caso={caso} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      {totalCasos > 0 && (
        <section className="bg-brown-100 py-12">
          <div className="container-app text-center">
            <h2 className="text-2xl font-bold text-brown-800 mb-4">
              ¿Querés ser parte de un nuevo caso de éxito?
            </h2>
            <p className="text-brown-600 mb-6 max-w-2xl mx-auto">
              Hay muchos animales esperando encontrar su hogar.
              Adoptá y ayudanos a sumar más historias felices.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-terracotta-600 text-white px-6 py-3 rounded-lg hover:bg-terracotta-700 transition-colors font-medium"
            >
              <Heart className="w-5 h-5" />
              Ver animales en adopción
            </a>
          </div>
        </section>
      )}
    </div>
  )
}

export default CasosExito
