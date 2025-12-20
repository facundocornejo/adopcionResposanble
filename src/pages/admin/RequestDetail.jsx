import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MapPin, User, Home, Users, Heart, Check, X, PawPrint } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { requestsService } from '../../services'
import { ESTADOS_SOLICITUD } from '../../utils/constants'
import { formatDate, getWhatsAppLink } from '../../utils/formatters'
import { Button, Badge, Spinner, Alert, Card, Select } from '../../components/ui'

/**
 * Página de detalle de una solicitud de adopción
 */
const RequestDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await requestsService.getById(id)
        setRequest(data)
        setNewStatus(data.estado)
      } catch (err) {
        setError(err.message || 'Error al cargar solicitud')
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequest()
  }, [id])

  const handleStatusUpdate = async () => {
    if (newStatus === request.estado) return

    setIsUpdating(true)
    try {
      await requestsService.updateStatus(id, newStatus)
      setRequest(prev => ({ ...prev, estado: newStatus }))
      toast.success(`Estado actualizado a "${newStatus}"`)
    } catch (err) {
      toast.error(err.message || 'Error al actualizar')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <Spinner center text="Cargando solicitud..." />
  }

  if (error || !request) {
    return (
      <div>
        <Alert variant="error" title="Error">
          {error || 'Solicitud no encontrada'}
        </Alert>
        <Link
          to="/admin/requests"
          className="inline-flex items-center text-terracotta-500 hover:text-terracotta-600 mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a solicitudes
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/requests"
          className="inline-flex items-center text-brown-500 hover:text-brown-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a solicitudes
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
              {request.nombre_completo}
            </h1>
            <p className="text-brown-500 text-sm mt-1">
              Solicitud recibida el {formatDate(request.created_at)}
            </p>
          </div>
          <Badge variant={Badge.getRequestVariant(request.estado)} size="md">
            {request.estado}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Info del solicitante */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos personales */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-lg font-semibold text-brown-900">
                Datos del Solicitante
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoField label="Nombre completo" value={request.nombre_completo} />
              <InfoField label="Edad" value={`${request.edad} años`} />
              <InfoField label="Email" value={request.email} />
              <InfoField label="Teléfono/WhatsApp" value={request.telefono_whatsapp} />
              <InfoField label="Ciudad/Zona" value={request.ciudad_zona} className="sm:col-span-2" />
            </div>
          </Card>

          {/* Vivienda */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-lg font-semibold text-brown-900">
                Información de Vivienda
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoField label="Tipo de vivienda" value={request.tipo_vivienda} />
              <InfoField
                label="¿Vivienda propia?"
                value={request.vivienda_propia ? 'Sí' : 'No, alquila'}
              />
              {request.vivienda_propia === false && (
                <InfoField
                  label="¿Permite mascotas?"
                  value={request.permite_mascotas ? 'Sí' : 'No'}
                />
              )}
              <InfoField label="Cantidad de convivientes" value={request.cantidad_convivientes} />
              <InfoField
                label="Todos de acuerdo"
                value={request.todos_de_acuerdo ? 'Sí' : 'No'}
                highlight={!request.todos_de_acuerdo}
              />
            </div>
          </Card>

          {/* Convivencia */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-lg font-semibold text-brown-900">
                Convivencia
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoField
                label="¿Hay niños?"
                value={request.hay_ninos ? `Sí - ${request.edades_ninos || 'edades no especificadas'}` : 'No'}
              />
              <InfoField
                label="¿Tiene otros animales?"
                value={request.tiene_otros_animales ? 'Sí' : 'No'}
              />
              {request.tiene_otros_animales && (
                <>
                  <InfoField
                    label="Descripción"
                    value={request.descripcion_otros_animales || 'No especificado'}
                    className="sm:col-span-2"
                  />
                  <InfoField
                    label="¿Están castrados?"
                    value={request.otros_animales_castrados ? 'Sí' : 'No'}
                  />
                </>
              )}
            </div>
          </Card>

          {/* Motivación */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-lg font-semibold text-brown-900">
                Experiencia y Motivación
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-brown-500 mb-1">Experiencia previa</p>
                <p className="text-brown-700 whitespace-pre-line">{request.experiencia_previa}</p>
              </div>
              <div>
                <p className="text-sm text-brown-500 mb-1">Motivación</p>
                <p className="text-brown-700 whitespace-pre-line">{request.motivacion}</p>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  {request.compromiso_castracion ? (
                    <Check className="w-4 h-4 text-sage-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-brown-600">Compromiso castración</span>
                </div>
                <div className="flex items-center gap-2">
                  {request.compromiso_seguimiento ? (
                    <Check className="w-4 h-4 text-sage-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-brown-600">Acepta seguimiento</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Animal solicitado */}
          <Card>
            <h2 className="text-lg font-semibold text-brown-900 mb-4">
              Animal Solicitado
            </h2>

            {request.animal ? (
              <>
                {request.animal.foto_principal ? (
                  <img
                    src={request.animal.foto_principal}
                    alt={request.animal.nombre}
                    className="w-full aspect-square object-cover rounded-xl mb-3"
                  />
                ) : (
                  <div className="w-full aspect-square bg-brown-100 rounded-xl mb-3 flex items-center justify-center">
                    <PawPrint className="w-12 h-12 text-brown-300" />
                  </div>
                )}
                <p className="font-medium text-brown-900">{request.animal.nombre}</p>
                <p className="text-sm text-brown-500">
                  {request.animal.especie} · {request.animal.tamanio} · {request.animal.edad_aproximada}
                </p>
                <Link
                  to={`/animal/${request.animal_id}`}
                  target="_blank"
                  className="text-sm text-terracotta-500 hover:text-terracotta-600 mt-2 inline-block"
                >
                  Ver ficha completa →
                </Link>
              </>
            ) : (
              <p className="text-brown-500">Animal #{request.animal_id}</p>
            )}
          </Card>

          {/* Acciones */}
          <Card>
            <h2 className="text-lg font-semibold text-brown-900 mb-4">
              Acciones
            </h2>

            <div className="space-y-3">
              <a
                href={getWhatsAppLink(request.telefono_whatsapp, `Hola ${request.nombre_completo}, te contacto por tu solicitud de adopción de ${request.animal?.nombre || 'nuestro animal'}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-sage-500 text-white rounded-xl font-medium hover:bg-sage-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Contactar por WhatsApp
              </a>

              <a
                href={`mailto:${request.email}?subject=Solicitud de adopción - ${request.animal?.nombre || ''}`}
                className="w-full flex items-center justify-center gap-2 py-3 border border-brown-200 text-brown-700 rounded-xl font-medium hover:bg-warm-50 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Enviar email
              </a>

              <hr className="border-brown-100 my-4" />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-700">
                  Cambiar estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-brown-200 rounded-xl focus:outline-none focus:border-terracotta-500 bg-white"
                >
                  {ESTADOS_SOLICITUD.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleStatusUpdate}
                isLoading={isUpdating}
                disabled={newStatus === request.estado}
                fullWidth
              >
                Actualizar estado
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar para campos de info
const InfoField = ({ label, value, className = '', highlight = false }) => (
  <div className={className}>
    <p className="text-sm text-brown-500">{label}</p>
    <p className={`font-medium ${highlight ? 'text-red-600' : 'text-brown-900'}`}>
      {value || '-'}
    </p>
  </div>
)

export default RequestDetail
