import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Save, Building2, Phone, Instagram, CreditCard } from 'lucide-react'
import { organizationService } from '../../services'
import {
  Button,
  Input,
  Textarea,
  Card,
  Spinner,
  Alert,
} from '../../components/ui'

/**
 * Página de configuración de la organización
 * Permite editar datos de contacto, redes sociales y donaciones
 */
const Settings = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      whatsapp: '',
      direccion: '',
      descripcion: '',
      instagram: '',
      facebook: '',
      donacion_alias: '',
      donacion_cbu: '',
      donacion_info: '',
    },
  })

  // Cargar datos de la organización
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const org = await organizationService.getMyOrganization()
        reset({
          nombre: org.nombre || '',
          email: org.email || '',
          telefono: org.telefono || '',
          whatsapp: org.whatsapp || '',
          direccion: org.direccion || '',
          descripcion: org.descripcion || '',
          instagram: org.instagram || '',
          facebook: org.facebook || '',
          donacion_alias: org.donacion_alias || '',
          donacion_cbu: org.donacion_cbu || '',
          donacion_info: org.donacion_info || '',
        })
      } catch (err) {
        setError(err.message || 'Error al cargar datos')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrganization()
  }, [reset])

  // Guardar cambios
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await organizationService.updateMyOrganization(data)
      toast.success('Configuración guardada correctamente')
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <Spinner center text="Cargando configuración..." />
  }

  if (error) {
    return (
      <Alert variant="error" title="Error">
        {error}
      </Alert>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
          Configuración
        </h1>
        <p className="text-brown-500 text-sm mt-1">
          Configurá los datos de tu organización o refugio
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Datos básicos */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-lg font-semibold text-brown-900">
                Datos de la Organización
              </h2>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre de la organización/refugio"
                placeholder="Ej: Refugio Patitas Felices"
                error={errors.nombre?.message}
                {...register('nombre', { required: 'El nombre es obligatorio' })}
              />

              <Input
                label="Email de contacto"
                type="email"
                placeholder="contacto@ejemplo.com"
                helperText="Acá te llegarán las notificaciones de nuevas solicitudes"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Teléfono"
                placeholder="Ej: 011-1234-5678"
                {...register('telefono')}
              />

              <Input
                label="Dirección / Zona"
                placeholder="Ej: Zona Norte, Buenos Aires"
                {...register('direccion')}
              />

              <Textarea
                label="Descripción"
                placeholder="Contá brevemente sobre tu organización o rescate..."
                rows={3}
                {...register('descripcion')}
              />
            </div>
          </Card>

          {/* Redes y contacto */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-lg font-semibold text-brown-900">
                Contacto y Redes Sociales
              </h2>
            </div>

            <div className="space-y-4">
              <Input
                label="WhatsApp"
                placeholder="Ej: 5491112345678 (sin espacios ni guiones)"
                helperText="Número con código de país para link directo"
                {...register('whatsapp')}
              />

              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <Input
                  label="Instagram"
                  placeholder="Ej: @refugio_patitas"
                  className="flex-1"
                  {...register('instagram')}
                />
              </div>

              <Input
                label="Facebook"
                placeholder="Ej: refugiopatitas o URL completa"
                helperText="Puede ser el nombre de usuario o la URL completa"
                {...register('facebook')}
              />
            </div>
          </Card>

          {/* Donaciones */}
          <Card className="lg:col-span-2 bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-brown-900">
                Datos para Donaciones
              </h2>
            </div>

            <p className="text-sm text-brown-600 mb-4">
              Estos datos se mostrarán en las fichas de tus animales para que las personas
              puedan colaborar con donaciones. Recordá que las donaciones van directamente
              a tu cuenta, la plataforma no interviene.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Alias de transferencia"
                placeholder="Ej: refugio.patitas"
                helperText="Alias de MercadoPago o banco"
                {...register('donacion_alias')}
              />

              <Input
                label="CBU/CVU (opcional)"
                placeholder="Ej: 0000000000000000000000"
                helperText="Se mostrará de forma segura"
                {...register('donacion_cbu')}
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Información adicional de donación"
                  placeholder="Ej: También aceptamos donaciones de alimento en nuestra sede..."
                  rows={3}
                  {...register('donacion_info')}
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-100 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Nota:</strong> La plataforma no gestiona ni se responsabiliza por las donaciones.
                Los fondos van directamente a la cuenta que especifiques. Asegurate de que los datos sean correctos.
              </p>
            </div>
          </Card>
        </div>

        {/* Botón guardar */}
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
            size="lg"
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Settings
