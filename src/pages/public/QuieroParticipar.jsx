import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Heart,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  PawPrint,
  CheckCircle
} from 'lucide-react'
import { Button, Input, Textarea, Card } from '../../components/ui'
import api from '../../services/api'

/**
 * Página pública para que rescatistas soliciten unirse a la plataforma
 */
const QuieroParticipar = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await api.post('/contact-requests', data)
      setIsSuccess(true)
      toast.success('¡Solicitud enviada correctamente!')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Error al enviar la solicitud')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pantalla de éxito
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
        <Card className="max-w-md text-center py-8">
          <CheckCircle className="w-16 h-16 text-sage-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brown-900 mb-2">
            ¡Solicitud enviada!
          </h1>
          <p className="text-brown-600 mb-6">
            Recibimos tu solicitud correctamente. Nos pondremos en contacto
            contigo a la brevedad para coordinar los próximos pasos.
          </p>
          <Link to="/">
            <Button variant="secondary">
              Volver al inicio
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white py-12 md:py-16">
        <div className="container-app">
          <Link
            to="/"
            className="inline-flex items-center text-terracotta-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Quiero ser rescatista
            </h1>
          </div>
          <p className="text-terracotta-100 max-w-2xl text-lg">
            ¿Tenés un refugio o rescatás animales de forma independiente?
            Unite a nuestra plataforma y llegá a más adoptantes potenciales.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-8 bg-white border-b">
        <div className="container-app">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                <PawPrint className="w-5 h-5 text-terracotta-600" />
              </div>
              <div>
                <h3 className="font-semibold text-brown-900">Publicá tus animales</h3>
                <p className="text-sm text-brown-600">
                  Subí fotos y datos de los animales que rescatás
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <h3 className="font-semibold text-brown-900">Recibí solicitudes</h3>
                <p className="text-sm text-brown-600">
                  Te llegan las solicitudes de adopción por email
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-brown-900">100% gratuito</h3>
                <p className="text-sm text-brown-600">
                  La plataforma es completamente gratuita
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-12">
        <div className="container-app max-w-2xl">
          <Card>
            <h2 className="text-xl font-bold text-brown-900 mb-6">
              Completá el formulario
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Datos del refugio */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brown-700">
                  <Building2 className="w-5 h-5" />
                  <h3 className="font-medium">Datos del refugio u organización</h3>
                </div>

                <Input
                  label="Nombre del refugio/organización *"
                  placeholder="Ej: Refugio Patitas Felices"
                  error={errors.nombre_refugio?.message}
                  {...register('nombre_refugio', {
                    required: 'El nombre es obligatorio'
                  })}
                />

                <Textarea
                  label="Descripción de tu trabajo *"
                  placeholder="Contanos brevemente sobre tu refugio o actividad de rescate. ¿Hace cuánto rescatás? ¿Con qué tipo de animales trabajás?"
                  rows={4}
                  error={errors.descripcion?.message}
                  {...register('descripcion', {
                    required: 'La descripción es obligatoria',
                    minLength: {
                      value: 50,
                      message: 'Por favor, escribí al menos 50 caracteres'
                    }
                  })}
                />

                <Input
                  label="Cantidad aproximada de animales que rescatás"
                  placeholder="Ej: 10-20 perros y gatos"
                  {...register('cantidad_animales')}
                />
              </div>

              {/* Datos de contacto */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-brown-700">
                  <User className="w-5 h-5" />
                  <h3 className="font-medium">Datos de contacto</h3>
                </div>

                <Input
                  label="Tu nombre completo *"
                  placeholder="Nombre y apellido"
                  error={errors.nombre_contacto?.message}
                  leftIcon={<User className="w-4 h-4" />}
                  {...register('nombre_contacto', {
                    required: 'Tu nombre es obligatorio'
                  })}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="tu@email.com"
                    error={errors.email?.message}
                    leftIcon={<Mail className="w-4 h-4" />}
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                  />

                  <Input
                    label="Teléfono/WhatsApp *"
                    placeholder="Ej: 3434123456"
                    error={errors.telefono?.message}
                    leftIcon={<Phone className="w-4 h-4" />}
                    {...register('telefono', {
                      required: 'El teléfono es obligatorio'
                    })}
                  />
                </div>

                <Input
                  label="Ciudad/Zona *"
                  placeholder="Ej: Paraná, Entre Ríos"
                  error={errors.ciudad?.message}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  {...register('ciudad', {
                    required: 'La ciudad es obligatoria'
                  })}
                />
              </div>

              {/* Redes sociales */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-brown-700">
                  <Instagram className="w-5 h-5" />
                  <h3 className="font-medium">Redes sociales (opcional)</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Instagram"
                    placeholder="@turefugio"
                    leftIcon={<Instagram className="w-4 h-4" />}
                    {...register('instagram')}
                  />

                  <Input
                    label="Facebook"
                    placeholder="facebook.com/turefugio"
                    leftIcon={<Facebook className="w-4 h-4" />}
                    {...register('facebook')}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-5 h-5" />}
                >
                  Enviar solicitud
                </Button>
                <p className="text-center text-sm text-brown-500 mt-3">
                  Revisaremos tu solicitud y te contactaremos a la brevedad
                </p>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default QuieroParticipar
