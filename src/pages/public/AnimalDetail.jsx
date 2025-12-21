import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  MapPin,
  Phone,
  Calendar,
  Ruler,
  Dog,
  Cat,
  Check,
  X,
  Instagram,
  Facebook,
  CreditCard,
  MessageCircle,
  Mail,
} from 'lucide-react'
import { useAnimal } from '../../hooks'
import { AnimalGallery } from '../../components/animals'
import { Button, Badge, Spinner, Alert, Card } from '../../components/ui'
import { getWhatsAppLink } from '../../utils/formatters'

/**
 * Página de detalle de un animal
 * Galería de fotos + información completa + CTA de adopción
 */
const AnimalDetail = () => {
  const { id } = useParams()
  const { animal, isLoading, error } = useAnimal(id)

  // Estado de carga
  if (isLoading) {
    return <Spinner center text="Cargando información..." />
  }

  // Error
  if (error) {
    return (
      <div className="container-app py-8">
        <Alert variant="error" title="Error al cargar">
          {error}
        </Alert>
        <div className="mt-4">
          <Link to="/" className="text-terracotta-500 hover:text-terracotta-600">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  // No encontrado
  if (!animal) {
    return (
      <div className="container-app py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-brown-900 mb-2">
          Animal no encontrado
        </h1>
        <p className="text-brown-500 mb-6">
          No pudimos encontrar el animal que buscás
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-terracotta-500 hover:text-terracotta-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>
      </div>
    )
  }

  // Preparar datos
  const fotos = [animal.foto_principal, animal.foto_2, animal.foto_3, animal.foto_4, animal.foto_5].filter(Boolean)
  const EspecieIcon = animal.especie === 'Perro' ? Dog : Cat
  const organizacion = animal.organizacion

  return (
    <div className="container-app py-6 md:py-8">
      {/* Breadcrumb */}
      <Link
        to="/"
        className="inline-flex items-center text-brown-500 hover:text-brown-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al catálogo
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Galería e info principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Galería de fotos */}
          <AnimalGallery fotos={fotos} nombre={animal.nombre} />

          {/* Información principal */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-brown-900">
                  {animal.nombre}
                </h1>
                <p className="text-lg text-brown-500 mt-1 flex items-center gap-2">
                  <EspecieIcon className="w-5 h-5" />
                  {animal.especie} · {animal.sexo} · {animal.edad_aproximada} · {animal.tamanio}
                </p>
              </div>
              <Badge
                variant={Badge.getAnimalVariant(animal.estado)}
                size="md"
              >
                {animal.estado === 'En transito' ? 'En tránsito' : animal.estado}
              </Badge>
            </div>
          </div>

          {/* Historia */}
          {animal.descripcion_historia && (
            <Card>
              <h2 className="text-xl font-semibold text-brown-900 mb-3">
                Su historia
              </h2>
              <p className="text-brown-700 leading-relaxed whitespace-pre-line">
                {animal.descripcion_historia}
              </p>
            </Card>
          )}

          {/* Características */}
          <Card>
            <h2 className="text-xl font-semibold text-brown-900 mb-4">
              Características
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoItem
                icon={<Ruler className="w-5 h-5" />}
                label="Tamaño"
                value={animal.tamanio}
              />
              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="Edad"
                value={animal.edad_aproximada}
              />
              <InfoItem
                icon={animal.estado_castracion ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Castrado"
                value={animal.estado_castracion ? 'Sí' : 'No'}
              />
              <InfoItem
                icon={animal.estado_vacunacion ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Vacunado"
                value={animal.estado_vacunacion || 'Sin info'}
              />
              <InfoItem
                icon={animal.estado_desparasitacion ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Desparasitado"
                value={animal.estado_desparasitacion ? 'Sí' : 'No'}
              />
            </div>
          </Card>

          {/* Socialización */}
          {(animal.socializa_perros !== null || animal.socializa_gatos !== null || animal.socializa_ninos !== null) && (
            <Card>
              <h2 className="text-xl font-semibold text-brown-900 mb-4">
                Socialización
              </h2>
              <div className="flex flex-wrap gap-3">
                {animal.socializa_perros !== null && (
                  <SocializationBadge
                    label="Perros"
                    value={animal.socializa_perros}
                  />
                )}
                {animal.socializa_gatos !== null && (
                  <SocializationBadge
                    label="Gatos"
                    value={animal.socializa_gatos}
                  />
                )}
                {animal.socializa_ninos !== null && (
                  <SocializationBadge
                    label="Niños"
                    value={animal.socializa_ninos}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Necesidades especiales */}
          {animal.necesidades_especiales && (
            <Card>
              <h2 className="text-xl font-semibold text-brown-900 mb-3">
                Necesidades especiales
              </h2>
              <p className="text-brown-700">
                {animal.necesidades_especiales}
              </p>
            </Card>
          )}
        </div>

        {/* Columna derecha - CTA y contacto */}
        <div className="space-y-6">
          {/* Card de adopción */}
          <Card className="sticky top-24">
            {animal.estado === 'Disponible' || animal.estado === 'En transito' ? (
              <>
                <div className="text-center mb-4">
                  <Heart className="w-12 h-12 text-terracotta-500 mx-auto mb-2" />
                  <p className="text-brown-600">
                    ¿Querés darle un hogar a {animal.nombre}?
                  </p>
                </div>
                <Link to={`/animal/${id}/adoptar`}>
                  <Button fullWidth size="lg">
                    Quiero adoptarlo
                  </Button>
                </Link>
                <p className="text-center text-sm text-brown-500 mt-3">
                  Te contactaremos para conocerte
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <Badge
                  variant={Badge.getAnimalVariant(animal.estado)}
                  size="md"
                >
                  {animal.estado}
                </Badge>
                <p className="text-brown-600 mt-3">
                  {animal.estado === 'Adoptado'
                    ? `${animal.nombre} ya encontró su hogar`
                    : `${animal.nombre} está en proceso de adopción`
                  }
                </p>
              </div>
            )}
          </Card>

          {/* Info del rescatista/organización */}
          <Card>
            <h3 className="text-sm text-brown-500 mb-1">
              Publicado por
            </h3>
            <p className="text-xl font-bold text-brown-900 mb-4">
              {organizacion?.nombre || animal.publicado_por}
            </p>

            {/* Datos de contacto organizados */}
            <div className="space-y-3">
              {/* WhatsApp del rescatista */}
              {animal.contacto_rescatista && (
                <a
                  href={getWhatsAppLink(animal.contacto_rescatista, `Hola! Vi a ${animal.nombre} en la plataforma de adopción y me gustaría saber más.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700">WhatsApp</p>
                    <p className="font-medium text-green-800">{animal.contacto_rescatista}</p>
                  </div>
                </a>
              )}

              {/* WhatsApp de la organización (si es diferente) */}
              {organizacion?.whatsapp && organizacion.whatsapp !== animal.contacto_rescatista && (
                <a
                  href={getWhatsAppLink(organizacion.whatsapp, `Hola! Vi a ${animal.nombre} en la plataforma de adopción.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700">WhatsApp del refugio</p>
                    <p className="font-medium text-green-800">{organizacion.whatsapp}</p>
                  </div>
                </a>
              )}

              {/* Email de la organización */}
              {organizacion?.email && (
                <a
                  href={`mailto:${organizacion.email}`}
                  className="flex items-center gap-3 p-3 bg-brown-50 hover:bg-brown-100 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-brown-400 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-brown-600">Email</p>
                    <p className="font-medium text-brown-800">{organizacion.email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Redes sociales */}
            {(organizacion?.instagram || organizacion?.facebook) && (
              <div className="mt-4 pt-4 border-t border-brown-100">
                <p className="text-xs text-brown-500 mb-2">Redes sociales</p>
                <div className="flex items-center gap-2">
                  {organizacion?.instagram && (
                    <a
                      href={`https://instagram.com/${organizacion.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-sm"
                    >
                      <Instagram className="w-4 h-4" />
                      {organizacion.instagram}
                    </a>
                  )}
                  {organizacion?.facebook && (
                    <a
                      href={organizacion.facebook.startsWith('http') ? organizacion.facebook : `https://facebook.com/${organizacion.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Sección de donaciones */}
          {(organizacion?.donacion_alias || organizacion?.donacion_info) && (
            <Card className="bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-brown-900">
                  Ayudá con una donación
                </h3>
              </div>
              <p className="text-sm text-brown-600 mb-3">
                Tu aporte ayuda a cubrir los gastos veterinarios y de cuidado de los animales rescatados.
              </p>
              {organizacion?.donacion_alias && (
                <div className="bg-white rounded-lg p-3 mb-2">
                  <p className="text-xs text-brown-500 mb-1">Alias de transferencia:</p>
                  <p className="font-mono font-medium text-brown-900 select-all">
                    {organizacion.donacion_alias}
                  </p>
                </div>
              )}
              {organizacion?.donacion_info && (
                <p className="text-sm text-brown-600 whitespace-pre-line">
                  {organizacion.donacion_info}
                </p>
              )}
              <p className="text-xs text-brown-400 mt-3 italic">
                Las donaciones son voluntarias y van directamente al rescatista. Esta plataforma no gestiona ni se responsabiliza por las mismas.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar para items de información
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-brown-400">{icon}</div>
    <div>
      <p className="text-xs text-brown-500">{label}</p>
      <p className="font-medium text-brown-900">{value}</p>
    </div>
  </div>
)

// Componente auxiliar para badges de socialización
const SocializationBadge = ({ label, value }) => (
  <span className={`
    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
    ${value
      ? 'bg-sage-100 text-sage-600'
      : value === false
        ? 'bg-red-100 text-red-600'
        : 'bg-brown-100 text-brown-500'
    }
  `}>
    {value ? <Check className="w-4 h-4" /> : value === false ? <X className="w-4 h-4" /> : null}
    {value ? `Sociable con ${label.toLowerCase()}` : value === false ? `No sociable con ${label.toLowerCase()}` : `${label}: No evaluado`}
  </span>
)

export default AnimalDetail
