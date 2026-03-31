import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PawPrint, Inbox, Heart, Clock, ArrowRight, AlertCircle,
  Plus, Eye, Settings, type LucideIcon,
} from 'lucide-react'
import api from '@/infrastructure/api/axios-client'
import { animalApi } from '@/infrastructure/api/animal-api'
import { requestApi } from '@/infrastructure/api/request-api'
import { useAuth } from '@/presentation/hooks'
import { Alert, Badge, Card } from '@/presentation/components/ui'
import type { Animal } from '@/domain/entities/animal'
import type { SolicitudAdopcion } from '@/domain/entities/adoption-request'

interface DashboardStats {
  totalAnimales: number
  disponibles: number
  adoptados: number
  enProceso: number
  totalSolicitudes: number
  nuevas: number
  pendientes: number
}

interface StatCardProps {
  icon: LucideIcon
  value: number
  label: string
  color: string
  highlight?: boolean
}

function StatCard({ icon: Icon, value, label, color, highlight }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (value === 0) return
    const duration = 600
    const steps = 20
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className={`card p-4 md:p-6 transition-all duration-200 hover:shadow-md ${highlight ? 'ring-2 ring-amber-400' : ''}`}>
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-brown-900 tabular-nums">{displayValue}</p>
      <p className="text-sm text-brown-500">{label}</p>
      {highlight && (
        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Requiere atención
        </p>
      )}
    </div>
  )
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)

  if (diffMin < 1) return 'Justo ahora'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffH < 24) return `Hace ${diffH}h`
  if (diffD < 7) return `Hace ${diffD} día${diffD > 1 ? 's' : ''}`
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function Dashboard() {
  const { admin } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentRequests, setRecentRequests] = useState<SolicitudAdopcion[]>([])
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Usar endpoint dedicado de stats + listas recientes en paralelo
        const [statsResponse, animalsData, requestsData] = await Promise.all([
          api.get<{ success: boolean; data: {
            resumen: { total_animales: number; total_solicitudes: number; solicitudes_ultimos_7_dias: number }
            animales_por_estado: { disponible: number; en_proceso: number; adoptado: number }
            solicitudes_por_estado: { nueva: number }
          }}>('/api/dashboard/stats'),
          animalApi.getAll({ limit: 5 }),
          requestApi.getAll({ limit: 5 }),
        ])

        const backendStats = statsResponse.data.data

        setStats({
          totalAnimales: backendStats.resumen.total_animales,
          disponibles: backendStats.animales_por_estado.disponible,
          adoptados: backendStats.animales_por_estado.adoptado,
          enProceso: backendStats.animales_por_estado.en_proceso,
          totalSolicitudes: backendStats.resumen.total_solicitudes,
          nuevas: backendStats.solicitudes_por_estado.nueva,
          pendientes: backendStats.resumen.solicitudes_ultimos_7_dias,
        })

        setRecentRequests(
          [...requestsData.solicitudes]
            .sort((a, b) => new Date(b.fecha_solicitud).getTime() - new Date(a.fecha_solicitud).getTime())
            .slice(0, 5)
        )

        setRecentAnimals(
          [...animalsData.animales]
            .sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime())
            .slice(0, 5)
        )
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Error al cargar datos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="h-8 w-64 skeleton rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="w-10 h-10 skeleton rounded-xl mb-3" />
              <div className="h-8 w-16 skeleton rounded mb-2" />
              <div className="h-4 w-24 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="error" title="Error al cargar">
        {error}
      </Alert>
    )
  }

  return (
    <div className="animate-fadeIn">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          highlight={(stats?.nuevas || 0) > 0}
        />
        <StatCard
          icon={Clock}
          value={stats?.pendientes || 0}
          label="Últimos 7 días"
          color="bg-sky-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/admin/animals/new', icon: Plus, label: 'Agregar animal', color: 'text-terracotta-500 bg-terracotta-50 hover:bg-terracotta-100' },
          { to: '/admin/requests', icon: Eye, label: 'Ver solicitudes', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
          { to: '/admin/animals', icon: PawPrint, label: 'Gestionar animales', color: 'text-sage-600 bg-sage-100 hover:bg-sage-200' },
          { to: '/admin/settings', icon: Settings, label: 'Configuración', color: 'text-brown-600 bg-brown-100 hover:bg-brown-200' },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${action.color}`}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Link>
        ))}
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
                  className="flex items-center justify-between p-3 bg-warm-50 hover:bg-warm-100 rounded-xl transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brown-900 truncate group-hover:text-terracotta-600 transition-colors">
                      {request.nombre_completo}
                    </p>
                    <p className="text-sm text-brown-500 truncate">
                      Para: {request.animal?.nombre || `Animal #${request.animal_id}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs text-brown-400 hidden sm:block">
                      {timeAgo(request.fecha_solicitud)}
                    </span>
                    <Badge variant={Badge.getRequestVariant(request.estado_solicitud)} size="sm">
                      {request.estado_solicitud}
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
                  className="flex items-center gap-3 p-3 bg-warm-50 hover:bg-warm-100 rounded-xl transition-colors group"
                >
                  {animal.foto_principal ? (
                    <img
                      src={animal.foto_principal}
                      alt={animal.nombre}
                      className="w-12 h-12 rounded-lg object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brown-200 rounded-lg flex items-center justify-center">
                      <PawPrint className="w-6 h-6 text-brown-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brown-900 truncate group-hover:text-terracotta-600 transition-colors">
                      {animal.nombre}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-brown-500">
                      <span>{animal.especie} · {animal.edad_aproximada}</span>
                      <span className="text-brown-300">·</span>
                      <span className="text-brown-400 text-xs">{timeAgo(animal.fecha_publicacion)}</span>
                    </div>
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
          {[
            { label: 'Disponibles', value: stats?.disponibles || 0, bg: 'bg-sage-50', text: 'text-sage-600' },
            { label: 'En proceso', value: stats?.enProceso || 0, bg: 'bg-amber-50', text: 'text-amber-600' },
            { label: 'Adoptados', value: stats?.adoptados || 0, bg: 'bg-terracotta-50', text: 'text-terracotta-600' },
            { label: 'Solicitudes', value: stats?.totalSolicitudes || 0, bg: 'bg-sky-50', text: 'text-sky-600' },
          ].map((item) => (
            <div key={item.label} className={`text-center p-4 ${item.bg} rounded-xl`}>
              <p className={`text-2xl font-bold ${item.text}`}>{item.value}</p>
              <p className={`text-sm ${item.text}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
