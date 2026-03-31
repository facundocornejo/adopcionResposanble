import { useState, useEffect, type ChangeEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Upload, X, Save, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { animalApi } from '@/infrastructure/api/animal-api'
import api from '@/infrastructure/api/axios-client'
import { animalSchema, type AnimalSchemaInput } from '@/shared/utils/validators'
import { ESPECIES, TAMANIOS, ESTADOS_ANIMAL } from '@/shared/constants'
import { useAuth } from '@/presentation/hooks'
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Card,
  Spinner,
  Alert,
  Modal,
  ShareButtons,
} from '@/presentation/components/ui'
import type { Animal } from '@/domain/entities/animal'

// Opciones para los selects
const SEXOS = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Hembra', label: 'Hembra' },
]

interface PhotoWithPreview {
  file: File
  preview: string
}

interface RadioGroupProps {
  label: string
  name: 'socializa_perros' | 'socializa_gatos' | 'socializa_ninos'
  register: UseFormRegister<AnimalSchemaInput>
}

/**
 * Componente auxiliar para radio groups de socialización
 */
function RadioGroup({ label, name, register }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-brown-700">{label}</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="true"
            {...register(name)}
            className="w-4 h-4 text-terracotta-500"
          />
          <span className="text-sm text-brown-700">Sí</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="false"
            {...register(name)}
            className="w-4 h-4 text-terracotta-500"
          />
          <span className="text-sm text-brown-700">No</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value=""
            {...register(name)}
            className="w-4 h-4 text-terracotta-500"
          />
          <span className="text-sm text-brown-700">No sé</span>
        </label>
      </div>
    </div>
  )
}

/**
 * Formulario para crear o editar un animal
 * Maneja subida de fotos con preview
 */
function AnimalForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { admin } = useAuth()
  const isEditing = Boolean(id)

  // Nombre de la organización del admin logueado
  const organizacionNombre = admin?.organizacion?.nombre || ''

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Modal de compartir post-creación
  const [createdAnimal, setCreatedAnimal] = useState<Animal | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  // Fotos
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  const [newPhotos, setNewPhotos] = useState<PhotoWithPreview[]>([])

  // Configurar form con campos que coinciden con la API
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AnimalSchemaInput>({
    resolver: zodResolver(animalSchema),
    mode: 'onSubmit',
    defaultValues: {
      nombre: '',
      especie: undefined,
      tamanio: undefined,
      edad_aproximada: '',
      sexo: undefined,
      raza_mezcla: '',
      estado_castracion: false,
      estado_vacunacion: '',
      estado_desparasitacion: false,
      estado: 'Disponible',
      descripcion_historia: '',
      necesidades_especiales: '',
      tipo_hogar_ideal: '',
      socializa_perros: null,
      socializa_gatos: null,
      socializa_ninos: null,
      publicado_por: organizacionNombre,
      contacto_rescatista: '',
      foto_principal: '',
    },
  })

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing && id) {
      const fetchAnimal = async () => {
        try {
          const animal = await animalApi.getById(Number(id))
          reset({
            nombre: animal.nombre || '',
            especie: animal.especie,
            tamanio: animal.tamanio,
            edad_aproximada: animal.edad_aproximada || '',
            sexo: animal.sexo,
            raza_mezcla: animal.raza_mezcla || '',
            estado_castracion: animal.estado_castracion || false,
            estado_vacunacion: animal.estado_vacunacion || '',
            estado_desparasitacion: animal.estado_desparasitacion || false,
            estado: animal.estado || 'Disponible',
            descripcion_historia: animal.descripcion_historia || '',
            necesidades_especiales: animal.necesidades_especiales || '',
            tipo_hogar_ideal: (animal as unknown as { tipo_hogar_ideal?: string | null }).tipo_hogar_ideal || '',
            socializa_perros: animal.socializa_perros,
            socializa_gatos: animal.socializa_gatos,
            socializa_ninos: animal.socializa_ninos,
            publicado_por: animal.publicado_por || '',
            contacto_rescatista: animal.contacto_rescatista || '',
            foto_principal: animal.foto_principal || '',
          })

          // Fotos existentes
          const fotos = [
            animal.foto_principal,
            animal.foto_2,
            animal.foto_3,
            animal.foto_4,
            animal.foto_5,
          ].filter((f): f is string => Boolean(f))
          setExistingPhotos(fotos)
        } catch (err) {
          const error = err as Error
          setLoadError(error.message || 'Error al cargar animal')
        } finally {
          setIsLoading(false)
        }
      }
      fetchAnimal()
    }
  }, [id, isEditing, reset])

  // Para nuevo animal: setear publicado_por con nombre de organización
  useEffect(() => {
    if (!isEditing && organizacionNombre) {
      setValue('publicado_por', organizacionNombre)
    }
  }, [isEditing, organizacionNombre, setValue])

  // Manejar selección de fotos
  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxPhotos = 5 - existingPhotos.length - newPhotos.length

    if (files.length > maxPhotos) {
      toast.error(`Podés subir máximo ${maxPhotos} fotos más`)
      return
    }

    // Crear previews
    const photosWithPreview: PhotoWithPreview[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setNewPhotos(prev => [...prev, ...photosWithPreview])
  }

  // Eliminar foto nueva
  const removeNewPhoto = (index: number) => {
    setNewPhotos(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  // Eliminar foto existente
  const removeExistingPhoto = (photoUrl: string) => {
    setExistingPhotos(prev => prev.filter(p => p !== photoUrl))
  }

  // Enviar formulario
  const onSubmit = async (data: AnimalSchemaInput) => {
    setIsSubmitting(true)

    try {
      // Primero subir las fotos nuevas a Cloudinary
      const uploadedPhotoUrls: string[] = []

      for (const photo of newPhotos) {
        const formData = new FormData()
        formData.append('image', photo.file)

        try {
          const response = await api.post<{ success: boolean; data: { url: string } }>(
            '/api/upload',
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          )

          if (response.data.data?.url) {
            uploadedPhotoUrls.push(response.data.data.url)
          }
        } catch (uploadError) {
          console.error('Error subiendo foto:', uploadError)
          toast.error('Error al subir una de las fotos')
        }
      }

      // Combinar fotos existentes + nuevas subidas
      const allPhotos = [...existingPhotos, ...uploadedPhotoUrls]

      // Preparar datos para enviar - combinar form data con fotos
      const animalData = {
        ...data,
        // Limpiar strings vacíos a null
        raza_mezcla: data.raza_mezcla || null,
        estado_vacunacion: data.estado_vacunacion || null,
        necesidades_especiales: data.necesidades_especiales || null,
        tipo_hogar_ideal: data.tipo_hogar_ideal || null,
        // Asignar fotos a los campos correspondientes
        foto_principal: allPhotos[0] || '',
        foto_2: allPhotos[1] || null,
        foto_3: allPhotos[2] || null,
        foto_4: allPhotos[3] || null,
        foto_5: allPhotos[4] || null,
      }

      if (isEditing && id) {
        await animalApi.update(Number(id), animalData)
        toast.success('Animal actualizado correctamente')
        setCreatedAnimal({
          ...animalData,
          id: Number(id),
          nombre: data.nombre,
          especie: data.especie,
          edad_aproximada: data.edad_aproximada,
          estado: data.estado,
          descripcion_historia: data.descripcion_historia,
          foto_principal: allPhotos[0] || '',
          fecha_publicacion: new Date().toISOString(),
        } as Animal)
        setShowShareModal(true)
      } else {
        const result = await animalApi.create(animalData)
        toast.success('Animal creado correctamente')
        // Construir animal completo para compartir: el backend solo devuelve id/nombre/estado/fecha
        // así que combinamos los datos del form con el id del resultado
        setCreatedAnimal({
          ...animalData,
          id: result.id,
          nombre: data.nombre,
          especie: data.especie,
          edad_aproximada: data.edad_aproximada,
          estado: data.estado,
          descripcion_historia: data.descripcion_historia,
          foto_principal: allPhotos[0] || '',
          fecha_publicacion: result.fecha_publicacion || new Date().toISOString(),
        } as Animal)
        setShowShareModal(true)
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: { details?: Array<{ message: string }> } } }; message?: string }
      // Mostrar errores detallados del backend
      if (error.response?.data?.error?.details) {
        const details = error.response.data.error.details
        details.forEach(detail => {
          toast.error(detail.message)
        })
      } else {
        toast.error(error.message || 'Error al guardar')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar errores de validación
  const onValidationError = (validationErrors: typeof errors) => {
    console.log('Errores de validación:', validationErrors)
    const errorCount = Object.keys(validationErrors).length
    toast.error(`Hay ${errorCount} campo(s) con errores. Revisá el formulario.`)
  }

  if (isLoading) {
    return <Spinner center text="Cargando animal..." />
  }

  if (loadError) {
    return (
      <div>
        <Alert variant="error" title="Error al cargar">
          {loadError}
        </Alert>
        <Link
          to="/admin/animals"
          className="inline-flex items-center text-terracotta-500 hover:text-terracotta-600 mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a animales
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/animals"
          className="inline-flex items-center text-brown-500 hover:text-brown-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a animales
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
          {isEditing ? 'Editar Animal' : 'Nuevo Animal'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onValidationError)}>
        {/* Mensaje de campos obligatorios */}
        <p className="text-sm text-brown-500 mb-4">
          Los campos marcados con <span className="text-red-500">*</span> son obligatorios
        </p>

        {/* Resumen de errores */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Por favor corregí los siguientes errores:</h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error?.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fotos */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Fotos</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Fotos existentes */}
                {existingPhotos.map((photo, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photo)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Fotos nuevas */}
                {newPhotos.map((photo, index) => (
                  <div key={`new-${index}`} className="relative aspect-square">
                    <img
                      src={photo.preview}
                      alt={`Nueva foto ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                      Nueva
                    </span>
                  </div>
                ))}

                {/* Botón agregar */}
                {existingPhotos.length + newPhotos.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-brown-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-terracotta-500 hover:bg-terracotta-50 transition-colors">
                    <Upload className="w-8 h-8 text-brown-400 mb-2" />
                    <span className="text-sm text-brown-500">Agregar foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-brown-500 mt-3">
                Máximo 5 fotos. La primera será la foto principal.
              </p>
            </Card>

            {/* Info básica */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Información básica</h2>

              <div className="space-y-4">
                <Input
                  label="Nombre *"
                  placeholder="Nombre del animal"
                  error={errors.nombre?.message}
                  {...register('nombre')}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Especie *"
                    options={ESPECIES}
                    error={errors.especie?.message}
                    {...register('especie')}
                  />
                  <Select
                    label="Sexo *"
                    options={SEXOS}
                    error={errors.sexo?.message}
                    {...register('sexo')}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Tamaño *"
                    options={TAMANIOS}
                    error={errors.tamanio?.message}
                    {...register('tamanio')}
                  />
                  <Input
                    label="Edad aproximada *"
                    placeholder="Ej: 2 años, 6 meses, cachorro"
                    error={errors.edad_aproximada?.message}
                    {...register('edad_aproximada')}
                  />
                </div>

                <Select
                  label="Estado *"
                  options={ESTADOS_ANIMAL}
                  error={errors.estado?.message}
                  {...register('estado')}
                />
              </div>
            </Card>

            {/* Historia */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Historia y descripción</h2>

              <div className="space-y-4">
                <Textarea
                  label="Historia de rescate *"
                  placeholder="Contá cómo llegó este animalito, su personalidad, qué le gusta... (mínimo 50 caracteres)"
                  rows={5}
                  maxLength={2000}
                  error={errors.descripcion_historia?.message}
                  {...register('descripcion_historia')}
                />

                <Textarea
                  label="Necesidades especiales"
                  placeholder="Si tiene alguna condición médica, tratamiento, dieta especial... (opcional)"
                  rows={3}
                  maxLength={500}
                  error={errors.necesidades_especiales?.message}
                  {...register('necesidades_especiales')}
                />

                <Textarea
                  label="Hogar ideal"
                  placeholder="Ej: Casa con patio, sin niños pequeños, debe dormir adentro, familia con tiempo..."
                  rows={3}
                  maxLength={500}
                  error={errors.tipo_hogar_ideal?.message}
                  {...register('tipo_hogar_ideal')}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salud */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Salud</h2>

              <div className="space-y-3">
                <Checkbox
                  label="Castrado/a"
                  {...register('estado_castracion')}
                />
                <Input
                  label="Estado de vacunación"
                  placeholder="Ej: Al día, Pendiente..."
                  {...register('estado_vacunacion')}
                />
                <Checkbox
                  label="Desparasitado/a"
                  {...register('estado_desparasitacion')}
                />
              </div>
            </Card>

            {/* Socialización */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Socialización</h2>

              <div className="space-y-4">
                <RadioGroup
                  label="¿Sociable con perros?"
                  name="socializa_perros"
                  register={register}
                />
                <RadioGroup
                  label="¿Sociable con gatos?"
                  name="socializa_gatos"
                  register={register}
                />
                <RadioGroup
                  label="¿Sociable con niños?"
                  name="socializa_ninos"
                  register={register}
                />
              </div>
            </Card>

            {/* Publicación */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Publicación</h2>

              <div className="space-y-4">
                <Input
                  label="Publicado por *"
                  placeholder="Nombre del refugio o rescatista"
                  error={errors.publicado_por?.message}
                  {...register('publicado_por')}
                />
              </div>
            </Card>

            {/* Botones */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/animals')}
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Save className="w-4 h-4" />}
                fullWidth
              >
                {isEditing ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Modal de compartir en redes post-creación */}
      <Modal
        isOpen={showShareModal}
        onClose={() => { setShowShareModal(false); navigate('/admin/animals') }}
        title={isEditing ? '¡Animal actualizado!' : '¡Animal publicado!'}
        size="sm"
      >
        {createdAnimal && (
          <div className="space-y-4">
            {/* Preview del animal */}
            {createdAnimal.foto_principal && (
              <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl">
                <img
                  src={createdAnimal.foto_principal}
                  alt={createdAnimal.nombre}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-brown-900 truncate">{createdAnimal.nombre}</p>
                  <p className="text-sm text-brown-500">{createdAnimal.especie} · {createdAnimal.edad_aproximada}</p>
                </div>
              </div>
            )}

            <p className="text-sm text-brown-500">
              Compartilo en redes para darle más visibilidad:
            </p>

            <ShareButtons animal={createdAnimal} size="md" />
          </div>
        )}

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => { setShowShareModal(false); navigate('/admin/animals') }}
            fullWidth
          >
            Ir a mis animales
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AnimalForm
