import { forwardRef } from 'react'
import { clsx } from 'clsx'

/**
 * Componente Input reutilizable
 *
 * @param {object} props
 * @param {string} props.label - Label del input
 * @param {string} props.error - Mensaje de error
 * @param {string} props.helperText - Texto de ayuda
 * @param {React.ReactNode} props.leftIcon - Ícono a la izquierda
 * @param {React.ReactNode} props.rightIcon - Ícono a la derecha
 * @param {boolean} props.required - Si es obligatorio
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  className,
  id,
  type = 'text',
  ...props
}, ref) => {
  // Generar ID único si no se proporciona
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-brown-700"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Ícono izquierdo */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={clsx(
            // Base
            'w-full px-4 py-3 bg-white border rounded-xl text-brown-900 text-base',
            'placeholder:text-brown-300',
            'transition-colors duration-200',
            // Focus
            'focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500',
            // Disabled
            'disabled:bg-brown-50 disabled:text-brown-400 disabled:cursor-not-allowed',
            // Error
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-brown-200',
            // Padding para íconos
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {/* Ícono derecho */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}

      {/* Texto de ayuda */}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-brown-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
