import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Building2,
  User,
  Save,
  Key,
  Copy,
  CheckCircle
} from 'lucide-react'
import { Button, Input, Textarea, Card, Alert } from '../../components/ui'
import api from '../../services/api'

/**
 * Formulario para crear nueva organización con admin
 */
const SuperAdminNewOrg = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdData, setCreatedData] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await api.post('/api/super-admin/organizations', data)
      setCreatedData(response.data.data)
      toast.success('Organización creada correctamente')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Error al crear')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado al portapapeles')
  }

  // Pantalla de éxito con credenciales
  if (createdData) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="text-center">
          <CheckCircle className="w-16 h-16 text-sage-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brown-900 mb-2">
            ¡Organización creada!
          </h1>
          <p className="text-brown-600 mb-6">
            {createdData.organizacion.nombre} fue creada correctamente.
          </p>

          <Alert variant="warning" className="text-left mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5" />
              <span className="font-semibold">Credenciales de acceso</span>
            </div>
            <p className="text-sm mb-3">
              Guardá estas credenciales y enviáselas al rescatista:
            </p>
            <div className="space-y-2 bg-white rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Usuario:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-brown-100 px-2 py-1 rounded text-sm">
                    {createdData.credenciales.username}
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdData.credenciales.username)}
                    className="p-1 hover:bg-brown-100 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Contraseña:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-brown-100 px-2 py-1 rounded text-sm">
                    {createdData.credenciales.password}
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdData.credenciales.password)}
                    className="p-1 hover:bg-brown-100 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Alert>

          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setCreatedData(null)
              }}
            >
              Crear otra
            </Button>
            <Link to="/admin/super/organizations">
              <Button>
                Ver organizaciones
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/super/organizations"
          className="inline-flex items-center text-brown-500 hover:text-brown-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a organizaciones
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-brown-900">
          Nueva Organización
        </h1>
        <p className="text-brown-500 text-sm mt-1">
          Crear un nuevo refugio/rescatista con su cuenta de administrador
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Datos de la organización */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-terracotta-500" />
            <h2 className="text-lg font-semibold text-brown-900">
              Datos de la Organización
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Nombre del refugio/organización *"
              placeholder="Ej: Refugio Patitas Felices"
              error={errors.nombre?.message}
              {...register('nombre', {
                required: 'El nombre es obligatorio'
              })}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Email de contacto"
                type="email"
                placeholder="contacto@refugio.com"
                {...register('email')}
              />

              <Input
                label="Teléfono"
                placeholder="Ej: 3434-123456"
                {...register('telefono')}
              />
            </div>

            <Input
              label="Dirección / Zona"
              placeholder="Ej: Paraná, Entre Ríos"
              {...register('direccion')}
            />

            <Textarea
              label="Descripción"
              placeholder="Breve descripción del refugio..."
              rows={3}
              {...register('descripcion')}
            />
          </div>
        </Card>

        {/* Datos del administrador */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-terracotta-500" />
            <h2 className="text-lg font-semibold text-brown-900">
              Cuenta de Administrador
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Username *"
              placeholder="Ej: patitas_admin"
              helperText="Nombre de usuario para iniciar sesión"
              error={errors.admin_username?.message}
              {...register('admin_username', {
                required: 'El username es obligatorio',
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Solo letras, números y guiones bajos'
                }
              })}
            />

            <Input
              label="Email del admin *"
              type="email"
              placeholder="admin@refugio.com"
              helperText="Acá recibirá las notificaciones"
              error={errors.admin_email?.message}
              {...register('admin_email', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
            />

            <Input
              label="Contraseña *"
              type="text"
              placeholder="Contraseña inicial"
              helperText="Se mostrará después de crear para enviársela al rescatista"
              error={errors.admin_password?.message}
              {...register('admin_password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'Mínimo 6 caracteres'
                }
              })}
            />
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Crear Organización
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SuperAdminNewOrg
