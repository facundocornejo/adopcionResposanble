import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Badge } from '../ui'
import { getPlaceholderImage } from '../../utils/formatters'

/**
 * Card de animal para el catálogo
 * Diseño mobile-first con foto protagonista
 */
const AnimalCard = ({ animal }) => {
  const {
    id,
    nombre,
    especie,
    edad_aproximada,
    tamanio,
    sexo,
    estado,
    foto_principal,
    zona_rescatista,
  } = animal

  // URL de la foto o placeholder
  const imageUrl = foto_principal || getPlaceholderImage(400, 300)

  return (
    <Link
      to={`/animal/${id}`}
      className="group block"
    >
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Foto - Protagonista */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={imageUrl}
            alt={`${nombre}, ${especie} en adopción`}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />

          {/* Badge de estado en la foto */}
          <div className="absolute top-3 left-3">
            <Badge variant={Badge.getAnimalVariant(estado)} size="sm">
              {estado}
            </Badge>
          </div>
        </div>

        {/* Información */}
        <div className="p-4">
          {/* Nombre */}
          <h3 className="text-lg font-semibold text-brown-900 group-hover:text-terracotta-500 transition-colors">
            {nombre}
          </h3>

          {/* Datos clave */}
          <p className="text-brown-500 text-sm mt-1">
            {especie} · {sexo} · {edad_aproximada} · {tamanio}
          </p>

          {/* Ubicación */}
          {zona_rescatista && (
            <div className="flex items-center gap-1 mt-2 text-brown-400 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{zona_rescatista}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export default AnimalCard
