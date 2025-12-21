import { useState } from 'react'
import { Heart, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

/**
 * Card para mostrar un caso de éxito
 */
const CasoExitoCard = ({ caso }) => {
  const [showModal, setShowModal] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Recopilar todas las fotos disponibles (actuales + original del animal)
  const fotos = [
    caso.foto_actual_1,
    caso.foto_actual_2,
    caso.foto_actual_3,
    caso.animal?.foto_principal
  ].filter(Boolean)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const nextPhoto = (e) => {
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev + 1) % fotos.length)
  }

  const prevPhoto = (e) => {
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev - 1 + fotos.length) % fotos.length)
  }

  return (
    <>
      {/* Card */}
      <article
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        {/* Imagen principal */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={fotos[0] || '/placeholder-animal.jpg'}
            alt={caso.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge de adoptado */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
              <Heart className="w-3 h-3 fill-current" />
              Adoptado
            </span>
          </div>

          {/* Indicador de más fotos */}
          {fotos.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
              +{fotos.length - 1} fotos
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Nombre del animal */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-brown-500 capitalize">
              {caso.animal?.especie || 'Animal'}
            </span>
            <span className="text-brown-300">•</span>
            <span className="text-sm font-medium text-brown-700">
              {caso.animal?.nombre}
            </span>
          </div>

          {/* Título */}
          <h3 className="font-semibold text-brown-800 mb-2 line-clamp-2">
            {caso.titulo}
          </h3>

          {/* Historia resumida */}
          <p className="text-sm text-brown-600 line-clamp-3 mb-3">
            {caso.historia}
          </p>

          {/* Fecha de adopción */}
          <div className="flex items-center gap-1 text-xs text-brown-400">
            <Calendar className="w-3 h-3" />
            <span>Adoptado en {formatDate(caso.fecha_adopcion)}</span>
          </div>
        </div>
      </article>

      {/* Modal de detalle */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Galería de fotos */}
            <div className="relative aspect-video bg-brown-100">
              <img
                src={fotos[currentPhotoIndex] || '/placeholder-animal.jpg'}
                alt={caso.titulo}
                className="w-full h-full object-contain"
              />

              {/* Botón cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-brown-600" />
              </button>

              {/* Navegación de fotos */}
              {fotos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-brown-600" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-brown-600" />
                  </button>

                  {/* Indicadores */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {fotos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentPhotoIndex(idx)
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Badge y nombre */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                  <Heart className="w-4 h-4 fill-current" />
                  Adoptado
                </span>
                <span className="text-brown-500">
                  {caso.animal?.nombre} • {caso.animal?.especie}
                </span>
              </div>

              {/* Título */}
              <h2 className="text-2xl font-bold text-brown-800 mb-4">
                {caso.titulo}
              </h2>

              {/* Historia completa */}
              <div className="prose prose-brown max-w-none mb-6">
                <p className="text-brown-600 whitespace-pre-line">
                  {caso.historia}
                </p>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-sm text-brown-500 pt-4 border-t border-brown-100">
                <Calendar className="w-4 h-4" />
                <span>Adoptado en {formatDate(caso.fecha_adopcion)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CasoExitoCard
