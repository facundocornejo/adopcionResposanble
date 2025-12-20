import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks'
import { loginSchema } from '../../utils/validators'
import { Button, Input, Alert } from '../../components/ui'

/**
 * Página de Login para administradores
 * Usa React Hook Form + Zod para validación
 * Redirige al dashboard después del login exitoso
 */
const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  // Obtener la ruta de redirección (si viene de una ruta protegida)
  const from = location.state?.from?.pathname || '/admin'

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Manejar submit
  const onSubmit = async (data) => {
    setIsLoading(true)
    setLoginError(null)

    try {
      await login(data.email, data.password)
      toast.success('¡Bienvenido!')
      navigate(from, { replace: true })
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        setLoginError('Email o contraseña incorrectos')
      } else if (error.response?.status === 429) {
        setLoginError('Demasiados intentos. Esperá unos minutos.')
      } else if (!error.response) {
        setLoginError('Error de conexión. Verificá tu internet.')
      } else {
        setLoginError(error.message || 'Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-semibold text-brown-900">
            Adopta<span className="text-terracotta-500">.</span>
          </Link>
          <p className="text-brown-500 mt-2">Panel de Administración</p>
        </div>

        {/* Card del formulario */}
        <div className="card p-6 md:p-8">
          <h1 className="text-xl font-semibold text-brown-900 mb-6">
            Iniciar sesión
          </h1>

          {/* Error de login */}
          {loginError && (
            <Alert variant="error" className="mb-4">
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-brown-400 hover:text-brown-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              leftIcon={<LogIn className="w-5 h-5" />}
            >
              Ingresar
            </Button>
          </form>
        </div>

        {/* Link volver */}
        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-terracotta-500 hover:text-terracotta-600 text-sm transition-colors"
          >
            ← Volver al sitio público
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
