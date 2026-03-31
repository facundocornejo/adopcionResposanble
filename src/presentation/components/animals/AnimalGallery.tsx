import { useState } from 'react'
import { ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { getPlaceholderImage } from '@/shared/utils/formatters'

export interface AnimalGalleryProps {
  /** Array de URLs de fotos */
  fotos?: string[]
  /** Nombre del animal para alt text */
  nombre: string
}

const PLACEHOLDER = getPlaceholderImage(800, 600)

/**
 * Galería de fotos del animal
 * Mobile: scroll horizontal con snap
 * Desktop: foto principal + thumbnails
 * Click en imagen principal abre lightbox
 */
function AnimalGallery({ fotos = [], nombre }: AnimalGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Si no hay fotos, mostrar placeholder
  const images = fotos.length > 0 ? fotos : [PLACEHOLDER]

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER
  }

  return (
    <>
      <div className="space-y-3">
        {/* Imagen principal */}
        <div className="relative aspect-[3/2] md:aspect-[4/3] rounded-2xl overflow-hidden bg-brown-100">
          <img
            src={images[selectedIndex]}
            alt={`${nombre} - Foto ${selectedIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            loading="lazy"
            onError={handleImageError}
            onClick={() => setLightboxOpen(true)}
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
                  loading="lazy"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <XIcon className="w-6 h-6 text-white" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <img
            src={images[selectedIndex]}
            alt={`${nombre} - Foto ${selectedIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onError={handleImageError}
          />
        </div>
      )}
    </>
  )
}

export default AnimalGallery
