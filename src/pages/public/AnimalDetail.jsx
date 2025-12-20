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
} from 'lucide-react'
import { useAnimal } from '../../hooks'
import { AnimalGallery } from '../../components/animals'
import { Button, Badge, Spinner, Alert, Card } from '../../components/ui'

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
  const fotos = animal.fotos || (animal.foto_principal ? [animal.foto_principal] : [])
  const EspecieIcon = animal.especie === 'Perro' ? Dog : Cat

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
                {animal.estado}
              </Badge>
            </div>

            {/* Ubicación */}
            {animal.zona_rescatista && (
              <div className="flex items-center gap-2 text-brown-600 mb-6">
                <MapPin className="w-4 h-4" />
                <span>{animal.zona_rescatista}</span>
              </div>
            )}
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
                icon={animal.castrado ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Castrado"
                value={animal.castrado ? 'Sí' : 'No'}
              />
              <InfoItem
                icon={animal.vacunado ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Vacunado"
                value={animal.vacunado ? 'Sí' : 'No'}
              />
              <InfoItem
                icon={animal.desparasitado ? <Check className="w-5 h-5 text-sage-500" /> : <X className="w-5 h-5 text-brown-400" />}
                label="Desparasitado"
                value={animal.desparasitado ? 'Sí' : 'No'}
              />
            </div>
          </Card>

          {/* Socialización */}
          {(animal.sociable_perros !== null || animal.sociable_gatos !== null || animal.sociable_ninos !== null) && (
            <Card>
              <h2 className="text-xl font-semibold text-brown-900 mb-4">
                Socialización
              </h2>
              <div className="flex flex-wrap gap-3">
                {animal.sociable_perros !== null && (
                  <SocializationBadge
                    label="Perros"
                    value={animal.sociable_perros}
                  />
                )}
                {animal.sociable_gatos !== null && (
                  <SocializationBadge
                    label="Gatos"
                    value={animal.sociable_gatos}
                  />
                )}
                {animal.sociable_ninos !== null && (
                  <SocializationBadge
                    label="Niños"
                    value={animal.sociable_ninos}
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
            {animal.estado === 'Disponible' ? (
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

          {/* Contacto del rescatista */}
          {animal.nombre_rescatista && (
            <Card>
              <h3 className="font-semibold text-brown-900 mb-3">
                Contacto del rescatista
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-brown-700">{animal.nombre_rescatista}</p>
                {animal.zona_rescatista && (
                  <p className="text-brown-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {animal.zona_rescatista}
                  </p>
                )}
                {animal.telefono_rescatista && (
                  <a
                    href={`tel:${animal.telefono_rescatista}`}
                    className="text-terracotta-500 hover:text-terracotta-600 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {animal.telefono_rescatista}
                  </a>
                )}
              </div>
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
