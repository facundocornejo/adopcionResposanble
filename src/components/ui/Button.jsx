import { forwardRef } from 'react'
import { clsx } from 'clsx'

/**
 * Componente Button reutilizable
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'} props.variant - Estilo visual
 * @param {'sm'|'md'|'lg'} props.size - Tamaño del botón
 * @param {boolean} props.fullWidth - Si ocupa todo el ancho
 * @param {boolean} props.isLoading - Muestra spinner de carga
 * @param {boolean} props.disabled - Deshabilita el botón
 * @param {React.ReactNode} props.leftIcon - Ícono a la izquierda
 * @param {React.ReactNode} props.rightIcon - Ícono a la derecha
 * @param {React.ReactNode} props.children - Contenido del botón
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className,
  type = 'button',
  ...props
}, ref) => {
  // Estilos base
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // Variantes de color
  const variants = {
    primary: 'bg-terracotta-500 text-white hover:bg-terracotta-600 active:bg-terracotta-700 focus:ring-terracotta-500',
    secondary: 'bg-white text-brown-700 border border-brown-200 hover:bg-warm-50 active:bg-brown-100 focus:ring-brown-300',
    danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-brown-600 hover:bg-warm-50 hover:text-brown-900 focus:ring-brown-300',
  }

  // Tamaños
  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {/* Spinner de carga */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Ícono izquierdo */}
      {!isLoading && leftIcon && (
        <span className="mr-2 -ml-1">{leftIcon}</span>
      )}

      {/* Contenido */}
      {children}

      {/* Ícono derecho */}
      {rightIcon && (
        <span className="ml-2 -mr-1">{rightIcon}</span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
