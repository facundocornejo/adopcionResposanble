import { useState, useEffect, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Save, Building2, Phone, Instagram, CreditCard, Upload, X, Lock } from 'lucide-react'
import api from '@/infrastructure/api/axios-client'
import { authApi } from '@/infrastructure/api/auth-api'
import { organizationApi } from '@/infrastructure/api/organization-api'
import {
  Button,
  Input,
  Textarea,
  Card,
  Spinner,
  Alert,
} from '@/presentation/components/ui'

interface OrganizationFormData {
  nombre: string
  email: string
  telefono: string
  whatsapp: string
  direccion: string
  descripcion: string
  instagram: string
  facebook: string
  donacion_alias: string
  donacion_cbu: string
  donacion_info: string
  logo_url: string
}

/**
 * Página de configuración de la organización
 * Permite editar datos de contacto, redes sociales y donaciones
 */
function Settings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OrganizationFormData>({
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
      logo_url: '',
    },
  })

  // Cargar datos de la organización
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const org = await organizationApi.getMyOrganization()
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
          logo_url: org.logo_url || '',
        })
        if (org.logo_url) setLogoPreview(org.logo_url)
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Error al cargar datos')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrganization()
  }, [reset])

  // Guardar cambios
  const onSubmit = async (data: OrganizationFormData) => {
    setIsSubmitting(true)
    try {
      await organizationApi.updateMyOrganization(data)
      toast.success('Configuración guardada correctamente')
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Error al guardar')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten imágenes JPG, PNG o WebP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB')
      return
    }

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const response = await api.post<{ success: boolean; data: { url: string } }>('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        const url = response.data.data.url
        setLogoPreview(url)
        setValue('logo_url', url)
        toast.success('Logo subido')
      }
    } catch {
      toast.error('Error al subir el logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setValue('logo_url', '')
  }

  // Cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleChangePassword = async () => {
    if (!passwordActual || !passwordNueva) {
      toast.error('Completá ambos campos')
      return
    }
    if (passwordNueva.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (passwordNueva !== passwordConfirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    setIsChangingPassword(true)
    try {
      await authApi.changePassword(passwordActual, passwordNueva)
      toast.success('Contraseña actualizada')
      setPasswordActual('')
      setPasswordNueva('')
      setPasswordConfirm('')
    } catch (err) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      toast.error(error.response?.data?.error?.message || error.message || 'Error al cambiar contraseña')
    } finally {
      setIsChangingPassword(false)
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

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-2">
                  Logo de la organización
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-20 h-20 rounded-xl object-cover border border-brown-200"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 border-2 border-dashed border-brown-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-terracotta-500 hover:bg-terracotta-50 transition-colors">
                      {uploadingLogo ? (
                        <div className="w-5 h-5 border-2 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-brown-400" />
                          <span className="text-xs text-brown-400 mt-1">Subir</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                  )}
                  <p className="text-sm text-brown-500">
                    JPG, PNG o WebP. Máx 5MB.
                  </p>
                </div>
              </div>

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

      {/* Cambio de contraseña - fuera del form de organización */}
      <Card className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-terracotta-500" />
          <h2 className="text-lg font-semibold text-brown-900">
            Cambiar Contraseña
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Contraseña actual"
            type="password"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            placeholder="Tu contraseña actual"
          />
          <Input
            label="Nueva contraseña"
            type="password"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Repetí la nueva contraseña"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={handleChangePassword}
            isLoading={isChangingPassword}
            variant="secondary"
            leftIcon={<Lock className="w-4 h-4" />}
          >
            Cambiar contraseña
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Settings
