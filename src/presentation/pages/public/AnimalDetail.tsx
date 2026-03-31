import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  Calendar,
  Ruler,
  Dog,
  Cat,
  Check,
  X,
  Instagram,
  Facebook,
  CreditCard,
} from 'lucide-react'
import { useAnimal } from '@/presentation/hooks'
import { AnimalGallery } from '@/presentation/components/animals'
import { Button, Badge, Spinner, Alert, Card, ShareButtons } from '@/presentation/components/ui'
import type { AnimalEstado, OrganizacionDetalle } from '@/domain/entities/animal'
import type { ReactNode } from 'react'

// Tipo extendido para el animal con organización completa
interface AnimalWithOrg {
  id: number
  nombre: string
  especie: 'Perro' | 'Gato'
  sexo: string
  edad_aproximada: string
  tamanio: string
  raza_mezcla?: string | null
  descripcion_historia?: string
  estado_castracion: boolean
  estado_vacunacion?: string | null
  estado_desparasitacion: boolean
  socializa_perros: boolean | null
  socializa_gatos: boolean | null
  socializa_ninos: boolean | null
  necesidades_especiales?: string | null
  estado: AnimalEstado
  publicado_por: string
  contacto_rescatista: string
  foto_principal: string
  foto_2?: string | null
  foto_3?: string | null
  foto_4?: string | null
  foto_5?: string | null
  organizacion?: OrganizacionDetalle
}

interface InfoItemProps {
  icon: ReactNode
  label: string
  value: string
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-brown-400">{icon}</div>
      <div>
        <p className="text-xs text-brown-500">{label}</p>
        <p className="font-medium text-brown-900">{value}</p>
      </div>
    </div>
  )
}

interface SocializationBadgeProps {
  label: string
  value: boolean | null
}

function SocializationBadge({ label, value }: SocializationBadgeProps) {
  return (
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
}

/**
 * Página de detalle de un animal
 * Galería de fotos + información completa + CTA de adopción
 */
function AnimalDetail() {
  const { id } = useParams<{ id: string }>()
  const { animal, isLoading, error } = useAnimal(id)

  // Cast a tipo con organización extendida
  const animalData = animal as AnimalWithOrg | null

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
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  // No encontrado
  if (!animalData) {
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
  const fotos = [
    animalData.foto_principal,
    animalData.foto_2,
    animalData.foto_3,
    animalData.foto_4,
    animalData.foto_5
  ].filter((foto): foto is string => Boolean(foto))

  const EspecieIcon = animalData.especie === 'Perro' ? Dog : Cat
  const organizacion = animalData.organizacion
  const isAdoptable = animalData.estado === 'Disponible' || animalData.estado === 'En transito'

  return (
    <div className="container-app py-6 md:py-8 pb-24 md:pb-8">
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
          <AnimalGallery fotos={fotos} nombre={animalData.nombre} />

          {/* Información principal */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-brown-900">
                {animalData.nombre}
              </h1>
              <Badge
                variant={Badge.getAnimalVariant(animalData.estado)}
                size="md"
                className="flex-shrink-0"
              >
                {animalData.estado === 'En transito' ? 'En tránsito' : animalData.estado}
              </Badge>
            </div>
            <p className="text-lg text-brown-500 flex items-center gap-2">
              <EspecieIcon className="w-5 h-5 flex-shrink-0" />
              {animalData.especie} · {animalData.sexo} · {animalData.edad_aproximada} · {animalData.tamanio}
            </p>
            <ShareButtons animal={animalData} size="sm" />
          </div>

          {/* Historia */}
          {animalData.descripcion_historia && (
            <Card>
              <h2 className="text-xl font-semibold text-brown-900 mb-3">
                Su historia
              </h2>
              <p className="text-brown-700 leading-relaxed whitespace-pre-line">
                {animalData.descripcion_historia}
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
                value={animalData.tamanio}
              />
              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="Edad"
                value={animalData.edad_aproximada}
              />
              <InfoItem
                icon={animalData.estado_castracion ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Castrado"
                value={animalData.estado_castracion ? 'Sí' : 'No'}
              />
              <InfoItem
                icon={animalData.estado_vacunacion ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Vacunado"
                value={animalData.estado_vacunacion || 'Sin info'}
              />
              <InfoItem
                icon={animalData.estado_desparasitacion ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Desparasitado"
                value={animalData.estado_desparasitacion ? 'Sí' : 'No'}
              />
            </div>
          </Card>

          {/* Socialización */}
          {(animalData.socializa_perros !== null || animalData.socializa_gatos !== null || animalData.socializa_ninos !== null) && (
            <Card>
              <h2 className="text-xl font-semibold text-brown-900 mb-4">
                Socialización
              </h2>
              <div className="flex flex-wrap gap-3">
                {animalData.socializa_perros !== null && (
                  <SocializationBadge
                    label="Perros"
                    value={animalData.socializa_perros}
                  />
                )}
                {animalData.socializa_gatos !== null && (
                  <SocializationBadge
                    label="Gatos"
                    value={animalData.socializa_gatos}
                  />
                )}
                {animalData.socializa_ninos !== null && (
                  <SocializationBadge
                    label="Niños"
                    value={animalData.socializa_ninos}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Necesidades especiales */}
          {animalData.necesidades_especiales && (
            <Card>
              <h2 className="text-xl font-semibold text-brown-900 mb-3">
                Necesidades especiales
              </h2>
              <p className="text-brown-700">
                {animalData.necesidades_especiales}
              </p>
            </Card>
          )}
        </div>

        {/* Columna derecha - CTA y contacto */}
        <div className="space-y-6">
          {/* Card de adopción */}
          <Card className="sticky top-24">
            {isAdoptable ? (
              <>
                <div className="text-center mb-4">
                  <Heart className="w-12 h-12 text-terracotta-500 mx-auto mb-2" />
                  <p className="text-brown-600">
                    ¿Querés darle un hogar a {animalData.nombre}?
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
                  variant={Badge.getAnimalVariant(animalData.estado)}
                  size="md"
                >
                  {animalData.estado}
                </Badge>
                <p className="text-brown-600 mt-3">
                  {animalData.estado === 'Adoptado'
                    ? `${animalData.nombre} ya encontró su hogar`
                    : `${animalData.nombre} está en proceso de adopción`
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
              {organizacion?.nombre || animalData.publicado_por}
            </p>

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

      {/* Mobile fixed bottom CTA bar */}
      {isAdoptable && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.1)] p-4 z-40">
          <Link to={`/animal/${id}/adoptar`}>
            <Button fullWidth size="lg">
              Quiero adoptarlo
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default AnimalDetail
