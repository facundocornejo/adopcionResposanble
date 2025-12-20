import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PawPrint, Inbox, Heart, Clock, ArrowRight, AlertCircle } from 'lucide-react'
import { animalsService, requestsService } from '../../services'
import { useAuth } from '../../hooks'
import { Spinner, Alert, Badge, Card } from '../../components/ui'
import { formatDate } from '../../utils/formatters'

/**
 * Dashboard del panel de administración
 * Muestra estadísticas y solicitudes recientes
 */
const Dashboard = () => {
  const { admin } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentRequests, setRecentRequests] = useState([])
  const [recentAnimals, setRecentAnimals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Cargar datos en paralelo
        const [animalsData, requestsData] = await Promise.all([
          animalsService.getAll(),
          requestsService.getAll(),
        ])

        // Calcular estadísticas
        const totalAnimales = animalsData.length
        const disponibles = animalsData.filter(a => a.estado === 'Disponible').length
        const adoptados = animalsData.filter(a => a.estado === 'Adoptado').length
        const enProceso = animalsData.filter(a => a.estado === 'En proceso').length

        const totalSolicitudes = requestsData.length
        const nuevas = requestsData.filter(r => r.estado === 'Nueva').length
        const pendientes = requestsData.filter(r =>
          r.estado === 'Nueva' || r.estado === 'Contactada'
        ).length

        setStats({
          totalAnimales,
          disponibles,
          adoptados,
          enProceso,
          totalSolicitudes,
          nuevas,
          pendientes,
        })

        // Solicitudes recientes (últimas 5)
        const sortedRequests = [...requestsData]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
        setRecentRequests(sortedRequests)

        // Animales recientes (últimos 5)
        const sortedAnimals = [...animalsData]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
        setRecentAnimals(sortedAnimals)

      } catch (err) {
        setError(err.message || 'Error al cargar datos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <Spinner center text="Cargando dashboard..." />
  }

  if (error) {
    return (
      <Alert variant="error" title="Error al cargar">
        {error}
      </Alert>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
          ¡Hola, {admin?.nombre || 'Admin'}!
        </h1>
        <p className="text-brown-500 mt-1">
          Resumen de la actividad reciente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={PawPrint}
          value={stats?.totalAnimales || 0}
          label="Total Animales"
          color="bg-terracotta-500"
        />
        <StatCard
          icon={Heart}
          value={stats?.disponibles || 0}
          label="Disponibles"
          color="bg-sage-500"
        />
        <StatCard
          icon={Inbox}
          value={stats?.nuevas || 0}
          label="Solicitudes Nuevas"
          color="bg-amber-500"
          highlight={stats?.nuevas > 0}
        />
        <StatCard
          icon={Clock}
          value={stats?.pendientes || 0}
          label="Pendientes"
          color="bg-sky-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Solicitudes recientes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brown-900">
              Solicitudes recientes
            </h2>
            <Link
              to="/admin/requests"
              className="text-sm text-terracotta-500 hover:text-terracotta-600 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <Link
                  key={request.id}
                  to={`/admin/requests/${request.id}`}
                  className="flex items-center justify-between p-3 bg-warm-50 hover:bg-warm-100 rounded-xl transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brown-900 truncate">
                      {request.nombre_completo}
                    </p>
                    <p className="text-sm text-brown-500 truncate">
                      Para: {request.animal?.nombre || `Animal #${request.animal_id}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Badge variant={Badge.getRequestVariant(request.estado)} size="sm">
                      {request.estado}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-brown-500">
              <Inbox className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay solicitudes aún</p>
            </div>
          )}
        </Card>

        {/* Animales recientes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brown-900">
              Animales recientes
            </h2>
            <Link
              to="/admin/animals"
              className="text-sm text-terracotta-500 hover:text-terracotta-600 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentAnimals.length > 0 ? (
            <div className="space-y-3">
              {recentAnimals.map((animal) => (
                <Link
                  key={animal.id}
                  to={`/admin/animals/${animal.id}/edit`}
                  className="flex items-center gap-3 p-3 bg-warm-50 hover:bg-warm-100 rounded-xl transition-colors"
                >
                  {animal.foto_principal ? (
                    <img
                      src={animal.foto_principal}
                      alt={animal.nombre}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brown-200 rounded-lg flex items-center justify-center">
                      <PawPrint className="w-6 h-6 text-brown-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brown-900 truncate">
                      {animal.nombre}
                    </p>
                    <p className="text-sm text-brown-500">
                      {animal.especie} · {animal.edad_aproximada}
                    </p>
                  </div>
                  <Badge variant={Badge.getAnimalVariant(animal.estado)} size="sm">
                    {animal.estado}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-brown-500">
              <PawPrint className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay animales registrados</p>
              <Link
                to="/admin/animals/new"
                className="text-terracotta-500 hover:text-terracotta-600 text-sm mt-2 inline-block"
              >
                Agregar el primero
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Resumen rápido */}
      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-brown-900 mb-4">
          Resumen de estados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-sage-50 rounded-xl">
            <p className="text-2xl font-bold text-sage-600">{stats?.disponibles || 0}</p>
            <p className="text-sm text-sage-600">Disponibles</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <p className="text-2xl font-bold text-amber-600">{stats?.enProceso || 0}</p>
            <p className="text-sm text-amber-600">En proceso</p>
          </div>
          <div className="text-center p-4 bg-terracotta-50 rounded-xl">
            <p className="text-2xl font-bold text-terracotta-600">{stats?.adoptados || 0}</p>
            <p className="text-sm text-terracotta-600">Adoptados</p>
          </div>
          <div className="text-center p-4 bg-sky-50 rounded-xl">
            <p className="text-2xl font-bold text-sky-600">{stats?.totalSolicitudes || 0}</p>
            <p className="text-sm text-sky-600">Solicitudes</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Componente auxiliar para las stat cards
const StatCard = ({ icon: Icon, value, label, color, highlight }) => (
  <div className={`card p-4 md:p-6 ${highlight ? 'ring-2 ring-amber-400' : ''}`}>
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-2xl md:text-3xl font-bold text-brown-900">{value}</p>
    <p className="text-sm text-brown-500">{label}</p>
    {highlight && (
      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Requiere atención
      </p>
    )}
  </div>
)

export default Dashboard
