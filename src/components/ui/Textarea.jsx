import { forwardRef } from 'react'
import { clsx } from 'clsx'

/**
 * Componente Textarea reutilizable
 *
 * @param {object} props
 * @param {string} props.label - Label del textarea
 * @param {string} props.error - Mensaje de error
 * @param {string} props.helperText - Texto de ayuda
 * @param {boolean} props.required - Si es obligatorio
 * @param {number} props.rows - Número de filas
 * @param {number} props.maxLength - Máximo de caracteres
 * @param {boolean} props.showCount - Mostrar contador de caracteres
 */
const Textarea = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  className,
  id,
  value,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const currentLength = value?.length || 0

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-brown-700"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={clsx(
          // Base
          'w-full px-4 py-3 bg-white border rounded-xl text-brown-900 text-base',
          'placeholder:text-brown-300',
          'transition-colors duration-200',
          'resize-none',
          // Focus
          'focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500',
          // Disabled
          'disabled:bg-brown-50 disabled:text-brown-400 disabled:cursor-not-allowed',
          // Error
          error
            ? 'border-error focus:border-error focus:ring-error'
            : 'border-brown-200',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />

      {/* Footer: error/helper + contador */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Mensaje de error */}
          {error && (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          )}

          {/* Texto de ayuda */}
          {helperText && !error && (
            <p className="text-sm text-brown-500">
              {helperText}
            </p>
          )}
        </div>

        {/* Contador de caracteres */}
        {showCount && maxLength && (
          <span className={clsx(
            'text-sm ml-2',
            currentLength >= maxLength ? 'text-error' : 'text-brown-400'
          )}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
