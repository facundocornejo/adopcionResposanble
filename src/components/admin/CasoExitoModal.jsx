import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Heart, Upload, X, PartyPopper, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../api/axios'
import { Button, Modal } from '../ui'

/**
 * Modal para crear un caso de éxito cuando un animal es adoptado
 */
const CasoExitoModal = ({ isOpen, onClose, animal, onSuccess }) => {
  const [step, setStep] = useState('congrats') // 'congrats' | 'form'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState([null, null, null])
  const [uploadingPhoto, setUploadingPhoto] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      titulo: animal ? `${animal.nombre} encontró su hogar` : '',
      historia: '',
      fecha_adopcion: new Date().toISOString().split('T')[0]
    }
  })

  const handleClose = () => {
    setStep('congrats')
    setPhotos([null, null, null])
    reset()
    onClose()
  }

  const handleSkip = () => {
    handleClose()
    onSuccess?.(false) // No se creó caso de éxito
  }

  const handleContinue = () => {
    setStep('form')
  }

  const handlePhotoUpload = async (index, file) => {
    if (!file) return

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten imágenes JPG, PNG o WebP')
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB')
      return
    }

    setUploadingPhoto(index)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        const newPhotos = [...photos]
        newPhotos[index] = response.data.data.url
        setPhotos(newPhotos)
        toast.success('Foto subida')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Error al subir la foto')
    } finally {
      setUploadingPhoto(null)
    }
  }

  const removePhoto = (index) => {
    const newPhotos = [...photos]
    newPhotos[index] = null
    setPhotos(newPhotos)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      const response = await api.post('/casos-exito', {
        animal_id: animal.id,
        titulo: data.titulo,
        historia: data.historia,
        fecha_adopcion: data.fecha_adopcion,
        foto_actual_1: photos[0],
        foto_actual_2: photos[1],
        foto_actual_3: photos[2]
      })

      if (response.data.success) {
        toast.success('Caso de éxito publicado')
        handleClose()
        onSuccess?.(true) // Se creó caso de éxito
      }
    } catch (error) {
      console.error('Error creating caso de éxito:', error)
      toast.error(error.response?.data?.error?.message || 'Error al crear el caso de éxito')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!animal) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'congrats' ? '' : 'Crear caso de éxito'}
      size={step === 'congrats' ? 'sm' : 'lg'}
    >
      {step === 'congrats' ? (
        /* Pantalla de felicitación */
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-purple-600" />
          </div>

          <h2 className="text-2xl font-bold text-brown-800 mb-2">
            {animal.nombre} fue adoptado
          </h2>

          <p className="text-brown-600 mb-6">
            ¿Querés compartir este caso de éxito en la sección pública?
            Podés agregar fotos actuales y contar su historia.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContinue}
              leftIcon={<Heart className="w-5 h-5 fill-current" />}
              className="w-full"
            >
              Sí, quiero compartirlo
            </Button>
            <Button
              variant="secondary"
              onClick={handleSkip}
              className="w-full"
            >
              No, solo marcar como adoptado
            </Button>
          </div>
        </div>
      ) : (
        /* Formulario de caso de éxito */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Info del animal */}
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
            {animal.foto_principal ? (
              <img
                src={animal.foto_principal}
                alt={animal.nombre}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-purple-200 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-brown-800">{animal.nombre}</h3>
              <p className="text-sm text-brown-500">
                {animal.especie} • {animal.tamanio}
              </p>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">
              Título del caso *
            </label>
            <input
              type="text"
              {...register('titulo', { required: 'El título es obligatorio' })}
              placeholder="Ej: Rocky encontró su familia ideal"
              className="w-full px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-500">{errors.titulo.message}</p>
            )}
          </div>

          {/* Historia */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">
              Historia del éxito *
            </label>
            <textarea
              {...register('historia', {
                required: 'La historia es obligatoria',
                minLength: { value: 20, message: 'La historia debe tener al menos 20 caracteres' }
              })}
              rows={4}
              placeholder="Contá cómo fue la adopción, cómo está el animal en su nuevo hogar..."
              className="w-full px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
            {errors.historia && (
              <p className="mt-1 text-sm text-red-500">{errors.historia.message}</p>
            )}
          </div>

          {/* Fecha de adopción */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">
              <Calendar className="w-4 h-4 inline-block mr-1" />
              Fecha de adopción *
            </label>
            <input
              type="date"
              {...register('fecha_adopcion', { required: 'La fecha es obligatoria' })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-brown-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            />
            {errors.fecha_adopcion && (
              <p className="mt-1 text-sm text-red-500">{errors.fecha_adopcion.message}</p>
            )}
          </div>

          {/* Fotos actuales */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-3">
              Fotos actuales (opcional)
            </label>
            <p className="text-sm text-brown-500 mb-3">
              Subí fotos de cómo está el animal ahora en su nuevo hogar
            </p>

            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl border-2 border-dashed border-brown-200 overflow-hidden relative bg-brown-50"
                >
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4 text-brown-600" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-brown-100 transition-colors">
                      {uploadingPhoto === index ? (
                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-brown-400 mb-1" />
                          <span className="text-xs text-brown-400">Subir</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handlePhotoUpload(index, e.target.files?.[0])}
                        className="hidden"
                        disabled={uploadingPhoto !== null}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-brown-100">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Heart className="w-5 h-5" />}
              className="flex-1"
            >
              Publicar
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default CasoExitoModal
