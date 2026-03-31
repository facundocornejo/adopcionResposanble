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
import { useAnimal } from '@/presentation/hooks'
import { requestApi } from '@/infrastructure/api/request-api'
import {
  adoptionFormSchema,
  type AdoptionFormInput,
} from '@/shared/utils/validators'
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Card,
  Spinner,
  Alert,
} from '@/presentation/components/ui'
import type { SolicitudInput } from '@/domain/entities/adoption-request'
import type { LucideIcon } from 'lucide-react'

// Configuración de los pasos
interface StepConfig {
  id: number
  title: string
  description: string
  icon: LucideIcon
  fields: (keyof AdoptionFormInput)[]
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Datos personales',
    description: 'Tu información de contacto',
    icon: User,
    fields: ['nombre_completo', 'edad', 'email', 'telefono_whatsapp', 'ciudad_zona'],
  },
  {
    id: 2,
    title: 'Vivienda',
    description: 'Sobre tu hogar',
    icon: Home,
    fields: ['tipo_vivienda', 'vivienda_propia', 'permite_mascotas', 'todos_de_acuerdo', 'cantidad_convivientes'],
  },
  {
    id: 3,
    title: 'Convivencia',
    description: 'Quiénes viven contigo',
    icon: Users,
    fields: ['hay_ninos', 'edades_ninos', 'tiene_otros_animales', 'descripcion_otros_animales', 'otros_animales_castrados'],
  },
  {
    id: 4,
    title: 'Motivación',
    description: 'Por qué querés adoptar',
    icon: Heart,
    fields: ['experiencia_previa', 'motivacion', 'compromiso_castracion', 'compromiso_seguimiento'],
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
function AdoptionForm() {
  const { id } = useParams<{ id: string }>()
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
  } = useForm<AdoptionFormInput>({
    resolver: zodResolver(adoptionFormSchema),
    mode: 'onTouched',
    defaultValues: {
      nombre_completo: '',
      edad: undefined,
      email: '',
      telefono_whatsapp: '',
      ciudad_zona: '',
      tipo_vivienda: undefined,
      vivienda_propia: undefined,
      permite_mascotas: undefined,
      todos_de_acuerdo: undefined,
      cantidad_convivientes: undefined,
      hay_ninos: undefined,
      edades_ninos: '',
      tiene_otros_animales: undefined,
      descripcion_otros_animales: '',
      otros_animales_castrados: undefined,
      experiencia_previa: '',
      motivacion: '',
      compromiso_castracion: undefined,
      compromiso_seguimiento: undefined,
    },
  })

  // Watch para campos condicionales
  const viviendaPropia = watch('vivienda_propia')
  const hayNinos = watch('hay_ninos')
  const tieneOtrosAnimales = watch('tiene_otros_animales')

  // Validar paso actual antes de avanzar
  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepConfig = STEPS[currentStep - 1]
    const isValid = await trigger(currentStepConfig.fields)

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
  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  // Helper para convertir valores booleanos
  const toBool = (val: unknown): boolean => val === true || val === 'true'

  // Enviar formulario
  const onSubmit = async (data: AdoptionFormInput) => {
    if (!id || !animal) return

    setIsSubmitting(true)

    try {
      // Construir descripción de convivientes para el backend
      let viveConDescripcion = `${data.cantidad_convivientes} persona(s)`
      if (toBool(data.hay_ninos) && data.edades_ninos) {
        viveConDescripcion += `, con niños de ${data.edades_ninos}`
      }
      if (!toBool(data.vivienda_propia)) {
        viveConDescripcion += toBool(data.permite_mascotas)
          ? ' (alquila, permite mascotas)'
          : ' (alquila)'
      }

      // Preparar datos en el formato que espera el backend
      const formData: SolicitudInput = {
        animal_id: parseInt(id, 10),
        nombre_completo: data.nombre_completo,
        edad: data.edad,
        email: data.email,
        telefono_whatsapp: data.telefono_whatsapp,
        ciudad_zona: data.ciudad_zona,
        tipo_vivienda: data.tipo_vivienda,
        vive_solo_acompanado: viveConDescripcion,
        todos_de_acuerdo: toBool(data.todos_de_acuerdo),
        tiene_otros_animales: toBool(data.tiene_otros_animales),
        otros_animales_castrados: toBool(data.tiene_otros_animales)
          ? (toBool(data.otros_animales_castrados) ? 'Sí' : 'No')
          : null,
        experiencia_previa: data.experiencia_previa,
        puede_cubrir_gastos: true,
        motivacion: data.motivacion,
        compromiso_castracion: toBool(data.compromiso_castracion),
        acepta_contacto: true,
      }

      await requestApi.create(formData)
      setSubmitSuccess(true)
      toast.success('¡Solicitud enviada con éxito!')
    } catch (error) {
      const axiosError = error as { response?: { data?: { error?: { details?: Array<{ message: string }> } } }; message?: string }
      if (axiosError.response?.data?.error?.details) {
        const details = axiosError.response.data.error.details
        details.forEach(detail => {
          toast.error(detail.message)
        })
      } else {
        toast.error(axiosError.message || 'Error al enviar la solicitud')
      }
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
            Volver al catálogo
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
        <div className="max-w-lg mx-auto text-center animate-fadeIn">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-12 h-12 text-sage-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center animate-float">
              <Heart className="w-4 h-4 text-terracotta-500" />
            </div>
            <div className="absolute bottom-0 -left-4 w-6 h-6 bg-amber-100 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          </div>

          <h1 className="text-3xl font-bold text-brown-900 mb-3">
            ¡Solicitud enviada!
          </h1>
          <p className="text-brown-600 mb-2 text-lg">
            Recibimos tu solicitud para adoptar a <strong className="text-terracotta-600">{animal.nombre}</strong>.
          </p>
          <p className="text-brown-500 mb-8">
            Nos vamos a comunicar con vos pronto para coordinar los siguientes pasos.
            El proceso suele tomar entre 3-7 días.
          </p>

          <Card className="mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-brown-600">
                <p className="font-medium text-brown-800 mb-1">¿Qué sigue?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>El rescatista revisa tu solicitud</li>
                  <li>Te contactamos para coordinar una visita</li>
                  <li>Se evalúa la compatibilidad mutua</li>
                  <li>¡Bienvenido a la familia!</li>
                </ol>
              </div>
            </div>
          </Card>

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
        </div>
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

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="font-medium text-terracotta-600">
            Paso {currentStep} de {STEPS.length}
          </span>
          <span className="text-brown-500">
            {Math.round((currentStep / STEPS.length) * 100)}% completado
          </span>
        </div>
        <div className="h-2 bg-brown-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 mt-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const isClickable = step.id < currentStep

            return (
              <div key={step.id} className="flex items-center flex-1">
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
          <p className="text-sm text-brown-500 mb-4">
            Todos los campos marcados con <span className="text-red-500">*</span> son obligatorios
          </p>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Por favor completá los campos obligatorios:</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>{(error as { message?: string })?.message}</li>
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
                      {...register('vivienda_propia')}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">Sí, es propia</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      {...register('vivienda_propia')}
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

              {(viviendaPropia === false || viviendaPropia === 'false' as unknown as boolean) && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-brown-700">
                    ¿El alquiler permite mascotas?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="true"
                        {...register('permite_mascotas')}
                        className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                      />
                      <span className="text-brown-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="false"
                        {...register('permite_mascotas')}
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-700">
                  ¿Hay niños en el hogar? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      {...register('hay_ninos')}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      {...register('hay_ninos')}
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

              {(hayNinos === true || hayNinos === 'true' as unknown as boolean) && (
                <Input
                  label="¿Qué edades tienen?"
                  placeholder="Ej: 5 y 8 años"
                  error={errors.edades_ninos?.message}
                  {...register('edades_ninos')}
                />
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-700">
                  ¿Tenés otros animales actualmente? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      {...register('tiene_otros_animales')}
                      className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <span className="text-brown-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      {...register('tiene_otros_animales')}
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

              {(tieneOtrosAnimales === true || tieneOtrosAnimales === 'true' as unknown as boolean) && (
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
                          {...register('otros_animales_castrados')}
                          className="w-4 h-4 text-terracotta-500 focus:ring-terracotta-500"
                        />
                        <span className="text-brown-700">Sí, todos</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="false"
                          {...register('otros_animales_castrados')}
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
            <div />
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={nextStep}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
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
