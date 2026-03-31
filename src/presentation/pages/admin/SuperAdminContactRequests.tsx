import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import {
  Inbox,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Clock,
  CheckCircle,
  XCircle,
  Building2
} from 'lucide-react'
import { Button, Card, Spinner, Alert, Badge } from '@/presentation/components/ui'
import api from '@/infrastructure/api/axios-client'
import type { SolicitudContacto, EstadoSolicitudContacto } from '@/domain/entities/super-admin'

import type { BadgeVariant } from '@/presentation/components/ui/Badge'

interface ApiResponse<T> {
  success: boolean
  data: T
}

interface SolicitudesResponse {
  solicitudes: SolicitudContacto[]
}

const statusVariants: Record<EstadoSolicitudContacto, BadgeVariant> = {
  'Pendiente': 'amber',
  'Aprobada': 'sage',
  'Rechazada': 'red'
}

function formatDateLocal(date: string): string {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Panel super-admin: Solicitudes de contacto de rescatistas
 */
function SuperAdminContactRequests() {
  const [solicitudes, setSolicitudes] = useState<SolicitudContacto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<EstadoSolicitudContacto | ''>('Pendiente')

  const fetchSolicitudes = useCallback(async () => {
    try {
      const params = filter ? `?estado=${filter}` : ''
      const response = await api.get<ApiResponse<SolicitudesResponse>>(`/api/super-admin/contact-requests${params}`)
      setSolicitudes(response.data.data.solicitudes)
    } catch (err) {
      const error = err as { response?: { data?: { error?: { message?: string } } } }
      setError(error.response?.data?.error?.message || 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchSolicitudes()
  }, [fetchSolicitudes])

  const handleUpdateStatus = async (id: number, estado: EstadoSolicitudContacto) => {
    try {
      await api.put(`/api/super-admin/contact-requests/${id}`, { estado })
      toast.success(`Solicitud marcada como ${estado.toLowerCase()}`)
      fetchSolicitudes()
    } catch (err) {
      const error = err as { response?: { data?: { error?: { message?: string } } } }
      toast.error(error.response?.data?.error?.message || 'Error al actualizar')
    }
  }

  if (isLoading) {
    return <Spinner center text="Cargando solicitudes..." />
  }

  if (error) {
    return (
      <Alert variant="error" title="Error">
        {error}
      </Alert>
    )
  }

  const filterOptions: (EstadoSolicitudContacto | '')[] = ['Pendiente', 'Aprobada', 'Rechazada', '']

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
          Solicitudes de Rescatistas
        </h1>
        <p className="text-brown-500 text-sm mt-1">
          Personas que quieren unirse a la plataforma
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map((estado) => (
          <button
            key={estado || 'all'}
            onClick={() => setFilter(estado)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === estado
                ? 'bg-terracotta-500 text-white'
                : 'bg-brown-100 text-brown-700 hover:bg-brown-200'
            }`}
          >
            {estado || 'Todas'}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {solicitudes.map((solicitud) => (
          <Card key={solicitud.id}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-terracotta-500" />
                  <h3 className="font-semibold text-brown-900 text-lg">
                    {solicitud.nombre_refugio}
                  </h3>
                  <Badge variant={statusVariants[solicitud.estado] || 'default'}>
                    {solicitud.estado}
                  </Badge>
                </div>

                <p className="text-brown-600 text-sm mb-3">
                  {solicitud.descripcion}
                </p>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-brown-600">
                      <span className="font-medium">Contacto:</span>
                      {solicitud.nombre_contacto}
                    </p>
                    <p className="flex items-center gap-2 text-brown-600">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${solicitud.email}`} className="text-terracotta-500 hover:underline">
                        {solicitud.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 text-brown-600">
                      <Phone className="w-4 h-4" />
                      {solicitud.telefono}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-brown-600">
                      <MapPin className="w-4 h-4" />
                      {solicitud.ciudad}
                    </p>
                    {solicitud.instagram && (
                      <p className="flex items-center gap-2 text-brown-600">
                        <Instagram className="w-4 h-4" />
                        {solicitud.instagram}
                      </p>
                    )}
                    {solicitud.facebook && (
                      <p className="flex items-center gap-2 text-brown-600">
                        <Facebook className="w-4 h-4" />
                        {solicitud.facebook}
                      </p>
                    )}
                    {solicitud.cantidad_animales && (
                      <p className="flex items-center gap-2 text-brown-600">
                        <span className="font-medium">Animales:</span>
                        {solicitud.cantidad_animales}
                      </p>
                    )}
                  </div>
                </div>

                <p className="flex items-center gap-2 text-xs text-brown-400 mt-3">
                  <Clock className="w-3 h-3" />
                  Recibida: {formatDateLocal(solicitud.fecha_solicitud)}
                </p>
              </div>

              {/* Acciones */}
              {solicitud.estado === 'Pendiente' && (
                <div className="flex lg:flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(solicitud.id, 'Aprobada')}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(solicitud.id, 'Rechazada')}
                    leftIcon={<XCircle className="w-4 h-4" />}
                  >
                    Rechazar
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {solicitudes.length === 0 && (
          <Card className="text-center py-8">
            <Inbox className="w-12 h-12 text-brown-300 mx-auto mb-3" />
            <p className="text-brown-500">
              No hay solicitudes {filter ? filter.toLowerCase() + 's' : ''}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SuperAdminContactRequests
