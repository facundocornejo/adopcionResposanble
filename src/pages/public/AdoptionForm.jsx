import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Home,
  Users,
  Heart,
  Send,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAnimal } from '../../hooks'
import { requestsService } from '../../services'
import {
  adoptionStep1Schema,
  adoptionStep2Schema,
  adoptionStep3Schema,
  adoptionStep4Schema,
  adoptionFormSchema,
} from '../../utils/validators'
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

// Configuración de los pasos
const STEPS = [
  {
    id: 1,
    title: 'Datos personales',
    description: 'Tu información de contacto',
    icon: User,
    schema: adoptionStep1Schema,
  },
  {
    id: 2,
    title: 'Vivienda',
    description: 'Sobre tu hogar',
    icon: Home,
    schema: adoptionStep2Schema,
  },
  {
    id: 3,
    title: 'Convivencia',
    description: 'Quiénes viven contigo',
    icon: Users,
    schema: adoptionStep3Schema,
  },
  {
    id: 4,
    title: 'Motivación',
    description: 'Por qué querés adoptar',
    icon: Heart,
    schema: adoptionStep4Schema,
  },
]

// Opciones para selects
const TIPOS_VIVIENDA = [
  { value: 'Casa con patio', label: 'Casa con patio' },
  { value: 'Casa sin patio', label: 'Casa sin patio' },
  { value: 'Departamento', label: 'Departamento' },
  { value: 'Otro', label: 'Otro' },
]

/**
 * Formulario de adopción en pasos (wizard)
 * 4 pasos con validación progresiva usando React Hook Form + Zod
 */
const AdoptionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { animal, isLoading: loadingAnimal, error: animalError } = useAnimal(id)

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Configurar React Hook Form con validación de Zod
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adoptionFormSchema),
    mode: 'onTouched',
    defaultValues: {
      nombre_completo: '',
      edad: '',
      email: '',
      telefono_whatsapp: '',
      ciudad_zona: '',
      tipo_vivienda: '',
      vivienda_propia: null,
      permite_mascotas: null,
      todos_de_acuerdo: false,
      cantidad_convivientes: '',
      hay_ninos: null,
      edades_ninos: '',
      tiene_otros_animales: null,
      descripcion_otros_animales: '',
      otros_animales_castrados: null,
      experiencia_previa: '',
      motivacion: '',
      compromiso_castracion: false,
      compromiso_seguimiento: false,
    },
  })

  // Watch para campos condicionales
  const viviendaPropia = watch('vivienda_propia')
  const hayNinos = watch('hay_ninos')
  const tieneOtrosAnimales = watch('tiene_otros_animales')

  // Validar paso actual antes de avanzar
  const validateCurrentStep = async () => {
    const currentStepConfig = STEPS[currentStep - 1]
    const fieldsToValidate = Object.keys(currentStepConfig.schema.shape)

    const isValid = await trigger(fieldsToValidate)

    if (!isValid) {
      toast.error('Por favor completá todos los campos obligatorios')
    }

    return isValid
  }

  // Ir al siguiente paso
  const nextStep = async () => {
    const isValid = await validateCurrentStep()

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      // Scroll al inicio del formulario
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Volver al paso anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Ir a un paso específico (solo si ya pasó por él)
  const goToStep = (step) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  // Enviar formulario
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      // Construir descripción de convivientes para el backend
      let viveConDescripcion = `${data.cantidad_convivientes} persona(s)`
      if (data.hay_ninos && data.edades_ninos) {
        viveConDescripcion += `, con niños de ${data.edades_ninos}`
      }
      if (!data.vivienda_propia) {
        viveConDescripcion += data.permite_mascotas
          ? ' (alquila, permite mascotas)'
          : ' (alquila)'
      }

      // Preparar datos en el formato que espera el backend
      const formData = {
        animal_id: parseInt(id, 10),
        nombre_completo: data.nombre_completo,
        edad: parseInt(data.edad, 10),
        email: data.email,
        telefono_whatsapp: data.telefono_whatsapp,
        ciudad_zona: data.ciudad_zona,
        tipo_vivienda: data.tipo_vivienda,
        vive_solo_acompanado: viveConDescripcion,
        todos_de_acuerdo: data.todos_de_acuerdo,
        tiene_otros_animales: data.tiene_otros_animales,
        otros_animales_castrados: data.tiene_otros_animales
          ? (data.otros_animales_castrados ? 'Sí' : 'No')
          : null,
        experiencia_previa: data.experiencia_previa,
        puede_cubrir_gastos: true, // Asumimos que si llenan el form, pueden cubrir gastos
        motivacion: data.motivacion,
        compromiso_castracion: data.compromiso_castracion,
        acepta_contacto: true,
      }

      await requestsService.create(formData)
      setSubmitSuccess(true)
      toast.success('¡Solicitud enviada con éxito!')
    } catch (error) {
      toast.error(error.message || 'Error al enviar la solicitud')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cargando animal
  if (loadingAnimal) {
    return <Spinner center text="Cargando información..." />
  }

  // Error al cargar animal
  if (animalError) {
    return (
      <div className="container-app py-8">
        <Alert variant="error" title="Error al cargar">
          {animalError}
        </Alert>
        <div className="mt-4">
          <Link to="/" className="text-terracotta-500 hover:text-terracotta-600">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  // Animal no encontrado
  if (!animal) {
    return (
      <div className="container-app py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-brown-900 mb-2">
          Animal no encontrado
        </h1>
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

  // Animal no disponible para adopción
  if (animal.estado !== 'Disponible' && animal.estado !== 'En transito') {
    return (
      <div className="container-app py-16 text-center">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-2xl font-bold text-brown-900 mb-2">
          {animal.nombre} no está disponible
        </h1>
        <p className="text-brown-500 mb-6">
          {animal.estado === 'Adoptado'
            ? 'Ya encontró su hogar'
            : 'Está en proceso de adopción'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-terracotta-500 hover:text-terracotta-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ver otros animales
        </Link>
      </div>
    )
  }

  // Éxito al enviar
  if (submitSuccess) {
    return (
      <div className="container-app py-16">
        <Card className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-sage-600" />
          </div>
          <h1 className="text-2xl font-bold text-brown-900 mb-2">
            ¡Solicitud enviada!
          </h1>
          <p className="text-brown-600 mb-6">
            Recibimos tu solicitud para adoptar a <strong>{animal.nombre}</strong>.
            Nos vamos a comunicar con vos pronto para coordinar los siguientes pasos.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate(`/animal/${id}`)} fullWidth>
              Ver perfil de {animal.nombre}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              fullWidth
            >
              Volver al catálogo
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container-app py-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/animal/${id}`}
          className="inline-flex items-center text-brown-500 hover:text-brown-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al perfil
        </Link>

        <div className="flex items-center gap-4">
          {animal.foto_principal && (
            <img
              src={animal.foto_principal}
              alt={animal.nombre}
              className="w-16 h-16 rounded-xl object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
              Adoptar a {animal.nombre}
            </h1>
            <p className="text-brown-500">
              Completá el formulario para iniciar el proceso
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const isClickable = step.id < currentStep

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => isClickable && goToStep(step.id)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full
                    transition-all duration-200
                    ${isCompleted
                      ? 'bg-sage-500 text-white cursor-pointer hover:bg-sage-600'
                      : isActive
                        ? 'bg-terracotta-500 text-white'
                        : 'bg-brown-100 text-brown-400'
                    }
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Step Label (hidden on mobile) */}
                <div className="hidden md:block ml-3 mr-4">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-terracotta-600' : 'text-brown-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-brown-400">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-2 rounded-full transition-colors
                    ${isCompleted ? 'bg-sage-500' : 'bg-brown-100'}
                  `} />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile Step Label */}
        <div className="md:hidden text-center mt-4">
          <p className="text-sm font-medium text-terracotta-600">
            Paso {currentStep}: {STEPS[currentStep - 1].title}
          </p>
          <p className="text-xs text-brown-400">
            {STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          {/* Mensaje de campos obligatorios */}
          <p className="text-sm text-brown-500 mb-4">
            Todos los campos marcados con <span className="text-red-500">*</span> son obligatorios
          </p>

          {/* Resumen de errores del paso actual */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Por favor completá los campos obligatorios:</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Datos Personales */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown-900 mb-4">
                Datos personales
              </h2>

              <Input
                label="Nombre completo *"
                placeholder="Tu nombre y apellido"
                error={errors.nombre_completo?.message}
                {...register('nombre_completo')}
              />

              <Input
                label="Edad *"
                type="number"
                placeholder="Tu edad (mínimo 18 años)"
                min={18}
                max={120}
                error={errors.edad?.message}
                {...register('edad', { valueAsNumber: true })}
              />

              <Input
                label="Email *"
                type="email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Teléfono / WhatsApp *"
                type="tel"
                placeholder="+54 9 343 123-4567"
                error={errors.telefono_whatsapp?.message}
                {...register('telefono_whatsapp')}
              />

              <Input
                label="Ciudad / Zona *"
                placeholder="Ej: Paraná Centro"
                error={errors.ciudad_zona?.message}
                {...register('ciudad_zona')}
              />
            </div>
          )}

          {/* Step 2: Vivienda */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown-900 mb-4">
                Sobre tu vivienda
              </h2>

              <Select
                label="Tipo de vivienda *"
                options={TIPOS_VIVIENDA}
                error={errors.tipo_vivienda?.message}
                {...register('tipo_vivienda')}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-700">
                  ¿Es vivienda propia? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      {...register('vivienda_propia', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">Sí, es propia</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      {...register('vivienda_propia', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">No, alquilo</span>
                  </label>
                </div>
                {errors.vivienda_propia && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.vivienda_propia.message}
                  </p>
                )}
              </div>

              {/* Campo condicional: permite mascotas (solo si alquila) */}
              {viviendaPropia === false && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-brown-700">
                    ¿El alquiler permite mascotas?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="true"
                        {...register('permite_mascotas', {
                          setValueAs: (v) => v === 'true',
                        })}
                        className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                      />
                      <span className="text-brown-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="false"
                        {...register('permite_mascotas', {
                          setValueAs: (v) => v === 'true',
                        })}
                        className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                      />
                      <span className="text-brown-700">No</span>
                    </label>
                  </div>
                </div>
              )}

              <Input
                label="¿Cuántas personas viven en tu hogar? *"
                type="number"
                placeholder="Incluyéndote"
                min={0}
                max={20}
                error={errors.cantidad_convivientes?.message}
                {...register('cantidad_convivientes', { valueAsNumber: true })}
              />

              <Checkbox
                label="Todos los convivientes están de acuerdo con la adopción *"
                error={errors.todos_de_acuerdo?.message}
                {...register('todos_de_acuerdo')}
              />
            </div>
          )}

          {/* Step 3: Convivencia */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown-900 mb-4">
                Convivencia
              </h2>

              {/* Hay niños */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-700">
                  ¿Hay niños en el hogar? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      {...register('hay_ninos', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      {...register('hay_ninos', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">No</span>
                  </label>
                </div>
                {errors.hay_ninos && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.hay_ninos.message}
                  </p>
                )}
              </div>

              {/* Edades de niños (condicional) */}
              {hayNinos === true && (
                <Input
                  label="¿Qué edades tienen?"
                  placeholder="Ej: 5 y 8 años"
                  error={errors.edades_ninos?.message}
                  {...register('edades_ninos')}
                />
              )}

              {/* Tiene otros animales */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-700">
                  ¿Tenés otros animales actualmente? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      {...register('tiene_otros_animales', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      {...register('tiene_otros_animales', {
                        setValueAs: (v) => v === 'true',
                      })}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">No</span>
                  </label>
                </div>
                {errors.tiene_otros_animales && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.tiene_otros_animales.message}
                  </p>
                )}
              </div>

              {/* Campos condicionales para otros animales */}
              {tieneOtrosAnimales === true && (
                <>
                  <Textarea
                    label="Contanos sobre ellos"
                    placeholder="Especie, edad, personalidad..."
                    rows={3}
                    maxLength={500}
                    error={errors.descripcion_otros_animales?.message}
                    {...register('descripcion_otros_animales')}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-brown-700">
                      ¿Están castrados?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="true"
                          {...register('otros_animales_castrados', {
                            setValueAs: (v) => v === 'true',
                          })}
                          className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                        />
                        <span className="text-brown-700">Sí, todos</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="false"
                          {...register('otros_animales_castrados', {
                            setValueAs: (v) => v === 'true',
                          })}
                          className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                        />
                        <span className="text-brown-700">No</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4: Motivación */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brown-900 mb-4">
                Experiencia y motivación
              </h2>

              <Textarea
                label="¿Tenés experiencia con mascotas? *"
                placeholder="Contanos sobre tu experiencia previa con animales... (mínimo 10 caracteres)"
                rows={3}
                maxLength={500}
                error={errors.experiencia_previa?.message}
                {...register('experiencia_previa')}
              />

              <Textarea
                label={`¿Por qué querés adoptar a ${animal.nombre}? *`}
                placeholder="Contanos qué te motivó a querer adoptarlo/a... (mínimo 20 caracteres)"
                rows={4}
                maxLength={1000}
                error={errors.motivacion?.message}
                {...register('motivacion')}
              />

              <div className="pt-4 border-t border-brown-100 space-y-3">
                <h3 className="font-medium text-brown-900">Compromisos obligatorios</h3>

                <Checkbox
                  label="Me comprometo a castrar al animal si no lo está *"
                  error={errors.compromiso_castracion?.message}
                  {...register('compromiso_castracion')}
                />

                <Checkbox
                  label="Acepto el seguimiento post-adopción y enviar fotos/actualizaciones *"
                  error={errors.compromiso_seguimiento?.message}
                  {...register('compromiso_seguimiento')}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
          ) : (
            <div /> // Spacer
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={nextStep}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar solicitud
            </Button>
          )}
        </div>
      </form>

      {/* Info Card */}
      <Card className="mt-8 bg-cream">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-terracotta-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-brown-900 mb-1">
              ¿Qué pasa después?
            </h3>
            <p className="text-sm text-brown-600">
              Una vez que envíes el formulario, el rescatista de {animal.nombre} va
              a revisar tu solicitud y se va a comunicar con vos para coordinar
              una visita y conocerse. El proceso suele tomar entre 3-7 días.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdoptionForm
