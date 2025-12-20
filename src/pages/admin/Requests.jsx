import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Eye, Clock, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { requestsService } from '../../services'
import { formatDate } from '../../utils/formatters'
import { Button, Badge, Spinner, Alert, Card } from '../../components/ui'

/**
 * Página de gestión de solicitudes de adopción
 */
const Requests = () => {
  const [requests, setRequests] = useState([])
  const [allRequests, setAllRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterEstado, setFilterEstado] = useState('')

  const fetchRequests = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await requestsService.getAll()
      const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setAllRequests(sorted)
      setRequests(filterEstado ? sorted.filter(r => r.estado === filterEstado) : sorted)
    } catch (err) {
      setError(err.message || 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Filtrar cuando cambia el estado
  useEffect(() => {
    if (filterEstado) {
      setRequests(allRequests.filter(r => r.estado === filterEstado))
    } else {
      setRequests(allRequests)
    }
  }, [filterEstado, allRequests])

  // Cambiar estado rápido
  const handleStatusChange = async (request, newStatus) => {
    try {
      await requestsService.updateStatus(request.id, newStatus)
      toast.success(`Solicitud marcada como "${newStatus}"`)
      fetchRequests()
    } catch (err) {
      toast.error(err.message || 'Error al cambiar estado')
    }
  }

  // Contar por estado
  const counts = {
    all: allRequests.length,
    Nueva: allRequests.filter(r => r.estado === 'Nueva').length,
    Contactada: allRequests.filter(r => r.estado === 'Contactada').length,
    Aprobada: allRequests.filter(r => r.estado === 'Aprobada').length,
    Rechazada: allRequests.filter(r => r.estado === 'Rechazada').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
          Solicitudes de Adopción
        </h1>
        <p className="text-brown-500 text-sm mt-1">
          {!isLoading && `${requests.length} solicitudes`}
        </p>
      </div>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterButton
          active={filterEstado === ''}
          onClick={() => setFilterEstado('')}
          count={counts.all}
        >
          Todas
        </FilterButton>
        <FilterButton
          active={filterEstado === 'Nueva'}
          onClick={() => setFilterEstado('Nueva')}
          count={counts.Nueva}
          highlight
        >
          Nuevas
        </FilterButton>
        <FilterButton
          active={filterEstado === 'Contactada'}
          onClick={() => setFilterEstado('Contactada')}
          count={counts.Contactada}
        >
          Contactadas
        </FilterButton>
        <FilterButton
          active={filterEstado === 'Aprobada'}
          onClick={() => setFilterEstado('Aprobada')}
          count={counts.Aprobada}
        >
          Aprobadas
        </FilterButton>
        <FilterButton
          active={filterEstado === 'Rechazada'}
          onClick={() => setFilterEstado('Rechazada')}
          count={counts.Rechazada}
        >
          Rechazadas
        </FilterButton>
      </div>

      {/* Loading */}
      {isLoading && <Spinner center text="Cargando solicitudes..." />}

      {/* Error */}
      {error && !isLoading && (
        <Alert variant="error" title="Error">{error}</Alert>
      )}

      {/* Lista vacía */}
      {!isLoading && !error && requests.length === 0 && (
        <Card className="text-center py-12">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-brown-300" />
          <h3 className="text-lg font-semibold text-brown-900 mb-2">
            No hay solicitudes
          </h3>
          <p className="text-brown-500">
            {filterEstado ? 'No hay solicitudes con ese estado' : 'Aún no llegaron solicitudes'}
          </p>
        </Card>
      )}

      {/* Lista */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-0 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-brown-900 truncate">
                        {request.nombre_completo}
                      </h3>
                      <Badge variant={Badge.getRequestVariant(request.estado)} size="sm">
                        {request.estado}
                      </Badge>
                    </div>

                    <p className="text-sm text-brown-600 mb-1">
                      Solicita adoptar a: <strong>{request.animal?.nombre || `Animal #${request.animal_id}`}</strong>
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brown-500">
                      <span>{request.email}</span>
                      <span>{request.telefono_whatsapp}</span>
                      <span>{request.ciudad_zona}</span>
                    </div>

                    <p className="text-xs text-brown-400 mt-2">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDate(request.created_at)}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <Link to={`/admin/requests/${request.id}`}>
                      <Button size="sm" variant="secondary" leftIcon={<Eye className="w-4 h-4" />}>
                        Ver detalle
                      </Button>
                    </Link>

                    {request.estado === 'Nueva' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusChange(request, 'Contactada')}
                      >
                        Marcar contactada
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick actions para estados */}
                {(request.estado === 'Nueva' || request.estado === 'Contactada') && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-brown-100">
                    <button
                      onClick={() => handleStatusChange(request, 'Aprobada')}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-sage-600 hover:bg-sage-50 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleStatusChange(request, 'Rechazada')}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Botón de filtro
const FilterButton = ({ children, active, onClick, count, highlight }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full text-sm font-medium transition-colors
      ${active
        ? 'bg-terracotta-500 text-white'
        : highlight && count > 0
          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          : 'bg-brown-100 text-brown-600 hover:bg-brown-200'
      }
    `}
  >
    {children}
    {count > 0 && (
      <span className={`ml-1.5 ${active ? 'text-white/80' : ''}`}>({count})</span>
    )}
  </button>
)

export default Requests
