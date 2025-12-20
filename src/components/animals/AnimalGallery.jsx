import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { getPlaceholderImage } from '../../utils/formatters'

/**
 * Galería de fotos del animal
 * Mobile: scroll horizontal con snap
 * Desktop: foto principal + thumbnails
 */
const AnimalGallery = ({ fotos = [], nombre }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Si no hay fotos, mostrar placeholder
  const images = fotos.length > 0 ? fotos : [getPlaceholderImage(800, 600)]

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div className="relative aspect-[3/2] md:aspect-[4/3] rounded-2xl overflow-hidden bg-brown-100">
        <img
          src={images[selectedIndex]}
          alt={`${nombre} - Foto ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Flechas de navegación - Solo si hay más de una foto */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 text-brown-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-5 h-5 text-brown-700" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all',
                    index === selectedIndex
                      ? 'bg-white w-4'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                  aria-label={`Ver foto ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails - Solo si hay más de una foto */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((foto, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={clsx(
                'flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all',
                index === selectedIndex
                  ? 'ring-2 ring-terracotta-500 ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              )}
            >
              <img
                src={foto}
                alt={`${nombre} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnimalGallery
