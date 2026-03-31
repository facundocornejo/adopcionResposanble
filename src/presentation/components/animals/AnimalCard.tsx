import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Badge, ShareButtons } from '../ui'
import { getPlaceholderImage } from '@/shared/utils/formatters'
import type { Animal, AnimalResumen, AnimalEstado } from '@/domain/entities/animal'

/**
 * Props para incluir zona_rescatista que puede venir del API
 * Compatible con Animal, AnimalResumen y respuestas extendidas del API
 */
export interface AnimalCardData {
  id: number
  nombre: string
  especie: string
  sexo: string
  edad_aproximada: string
  tamanio: string
  estado: AnimalEstado
  foto_principal: string
  zona_rescatista?: string
}

export interface AnimalCardProps {
  animal: AnimalCardData | Animal | AnimalResumen
}

/**
 * Card de animal para el catálogo
 * Diseño mobile-first con foto protagonista
 */
function AnimalCard({ animal }: AnimalCardProps) {
  const {
    id,
    nombre,
    especie,
    edad_aproximada,
    tamanio,
    sexo,
    estado,
    foto_principal,
  } = animal

  // zona_rescatista puede no existir en todos los tipos
  const zona_rescatista = 'zona_rescatista' in animal ? animal.zona_rescatista : undefined

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

          {/* Botones de compartir */}
          <div
            className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            <ShareButtons animal={animal} size="sm" useNativeShare />
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
