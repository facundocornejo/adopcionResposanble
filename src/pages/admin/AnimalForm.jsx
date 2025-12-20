import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Upload, X, Save, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { animalsService } from '../../services'
import { animalSchema } from '../../utils/validators'
import { ESPECIES, TAMANIOS, ESTADOS_ANIMAL } from '../../utils/constants'
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Card,
  Spinner,
  Alert,
} from '../../components/ui'

// Opciones para los selects
const SEXOS = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Hembra', label: 'Hembra' },
]

const ESPECIES_OPTIONS = ESPECIES.map(e => ({ value: e, label: e }))
const TAMANIOS_OPTIONS = TAMANIOS.map(t => ({ value: t, label: t }))
const ESTADOS_OPTIONS = ESTADOS_ANIMAL.map(e => ({ value: e, label: e }))

/**
 * Formulario para crear o editar un animal
 * Maneja subida de fotos con preview
 */
const AnimalForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(null)

  // Fotos
  const [existingPhotos, setExistingPhotos] = useState([])
  const [newPhotos, setNewPhotos] = useState([])
  const [photosToDelete, setPhotosToDelete] = useState([])

  // Configurar form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      nombre: '',
      especie: '',
      tamanio: '',
      edad_aproximada: '',
      sexo: '',
      castrado: false,
      vacunado: false,
      desparasitado: false,
      estado: 'Disponible',
      descripcion_historia: '',
      necesidades_especiales: '',
      sociable_perros: null,
      sociable_gatos: null,
      sociable_ninos: null,
      nombre_rescatista: '',
      telefono_rescatista: '',
      zona_rescatista: '',
    },
  })

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing) {
      const fetchAnimal = async () => {
        try {
          const animal = await animalsService.getById(id)
          reset({
            nombre: animal.nombre || '',
            especie: animal.especie || '',
            tamanio: animal.tamanio || '',
            edad_aproximada: animal.edad_aproximada || '',
            sexo: animal.sexo || '',
            castrado: animal.castrado || false,
            vacunado: animal.vacunado || false,
            desparasitado: animal.desparasitado || false,
            estado: animal.estado || 'Disponible',
            descripcion_historia: animal.descripcion_historia || '',
            necesidades_especiales: animal.necesidades_especiales || '',
            sociable_perros: animal.sociable_perros,
            sociable_gatos: animal.sociable_gatos,
            sociable_ninos: animal.sociable_ninos,
            nombre_rescatista: animal.nombre_rescatista || '',
            telefono_rescatista: animal.telefono_rescatista || '',
            zona_rescatista: animal.zona_rescatista || '',
          })

          // Fotos existentes
          if (animal.fotos?.length > 0) {
            setExistingPhotos(animal.fotos)
          } else if (animal.foto_principal) {
            setExistingPhotos([animal.foto_principal])
          }
        } catch (err) {
          setLoadError(err.message || 'Error al cargar animal')
        } finally {
          setIsLoading(false)
        }
      }
      fetchAnimal()
    }
  }, [id, isEditing, reset])

  // Manejar selección de fotos
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files)
    const maxPhotos = 5 - existingPhotos.length - newPhotos.length

    if (files.length > maxPhotos) {
      toast.error(`Podés subir máximo ${maxPhotos} fotos más`)
      return
    }

    // Crear previews
    const photosWithPreview = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setNewPhotos(prev => [...prev, ...photosWithPreview])
  }

  // Eliminar foto nueva
  const removeNewPhoto = (index) => {
    setNewPhotos(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  // Eliminar foto existente
  const removeExistingPhoto = (photoUrl) => {
    setExistingPhotos(prev => prev.filter(p => p !== photoUrl))
    setPhotosToDelete(prev => [...prev, photoUrl])
  }

  // Enviar formulario
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Agregar datos del formulario
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key])
        }
      })

      // Agregar fotos nuevas
      newPhotos.forEach(photo => {
        formData.append('fotos', photo.file)
      })

      // En edición, indicar fotos a eliminar
      if (isEditing && photosToDelete.length > 0) {
        formData.append('fotos_eliminar', JSON.stringify(photosToDelete))
      }

      if (isEditing) {
        await animalsService.update(id, formData)
        toast.success('Animal actualizado correctamente')
      } else {
        await animalsService.create(formData)
        toast.success('Animal creado correctamente')
      }

      navigate('/admin/animals')
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setIsSubmitting(false)
    }
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

      <form onSubmit={handleSubmit(onSubmit)}>
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
                  label="Nombre"
                  placeholder="Nombre del animal"
                  error={errors.nombre?.message}
                  {...register('nombre')}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Especie"
                    options={ESPECIES_OPTIONS}
                    error={errors.especie?.message}
                    {...register('especie')}
                  />
                  <Select
                    label="Sexo"
                    options={SEXOS}
                    error={errors.sexo?.message}
                    {...register('sexo')}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Tamaño"
                    options={TAMANIOS_OPTIONS}
                    error={errors.tamanio?.message}
                    {...register('tamanio')}
                  />
                  <Input
                    label="Edad aproximada"
                    placeholder="Ej: 2 años, 6 meses, cachorro"
                    error={errors.edad_aproximada?.message}
                    {...register('edad_aproximada')}
                  />
                </div>

                <Select
                  label="Estado"
                  options={ESTADOS_OPTIONS}
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
                  label="Historia de rescate"
                  placeholder="Contá cómo llegó este animalito, su personalidad, qué le gusta..."
                  rows={5}
                  maxLength={2000}
                  error={errors.descripcion_historia?.message}
                  {...register('descripcion_historia')}
                />

                <Textarea
                  label="Necesidades especiales (opcional)"
                  placeholder="Si tiene alguna condición médica, tratamiento, dieta especial..."
                  rows={3}
                  maxLength={500}
                  error={errors.necesidades_especiales?.message}
                  {...register('necesidades_especiales')}
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
                  {...register('castrado')}
                />
                <Checkbox
                  label="Vacunado/a"
                  {...register('vacunado')}
                />
                <Checkbox
                  label="Desparasitado/a"
                  {...register('desparasitado')}
                />
              </div>
            </Card>

            {/* Socialización */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Socialización</h2>

              <div className="space-y-4">
                <RadioGroup
                  label="¿Sociable con perros?"
                  name="sociable_perros"
                  register={register}
                />
                <RadioGroup
                  label="¿Sociable con gatos?"
                  name="sociable_gatos"
                  register={register}
                />
                <RadioGroup
                  label="¿Sociable con niños?"
                  name="sociable_ninos"
                  register={register}
                />
              </div>
            </Card>

            {/* Contacto rescatista */}
            <Card>
              <h2 className="text-lg font-semibold text-brown-900 mb-4">Contacto rescatista</h2>

              <div className="space-y-4">
                <Input
                  label="Nombre"
                  placeholder="Nombre del rescatista"
                  error={errors.nombre_rescatista?.message}
                  {...register('nombre_rescatista')}
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="+54 9 343 123-4567"
                  error={errors.telefono_rescatista?.message}
                  {...register('telefono_rescatista')}
                />
                <Input
                  label="Zona"
                  placeholder="Ej: Paraná Centro"
                  error={errors.zona_rescatista?.message}
                  {...register('zona_rescatista')}
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
    </div>
  )
}

// Componente auxiliar para radio groups de socialización
const RadioGroup = ({ label, name, register }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-brown-700">{label}</label>
    <div className="flex gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="true"
          {...register(name, { setValueAs: v => v === 'true' ? true : v === 'false' ? false : null })}
          className="w-4 h-4 text-terracotta-500"
        />
        <span className="text-sm text-brown-700">Sí</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="false"
          {...register(name, { setValueAs: v => v === 'true' ? true : v === 'false' ? false : null })}
          className="w-4 h-4 text-terracotta-500"
        />
        <span className="text-sm text-brown-700">No</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value=""
          {...register(name, { setValueAs: v => v === 'true' ? true : v === 'false' ? false : null })}
          className="w-4 h-4 text-terracotta-500"
        />
        <span className="text-sm text-brown-700">No sé</span>
      </label>
    </div>
  </div>
)

export default AnimalForm
