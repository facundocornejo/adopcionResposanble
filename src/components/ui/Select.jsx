import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

/**
 * Componente Select reutilizable
 *
 * @param {object} props
 * @param {string} props.label - Label del select
 * @param {string} props.error - Mensaje de error
 * @param {string} props.helperText - Texto de ayuda
 * @param {Array} props.options - Opciones del select [{value, label}]
 * @param {string} props.placeholder - Placeholder
 * @param {boolean} props.required - Si es obligatorio
 */
const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Seleccionar...',
  required = false,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-brown-700"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Select container */}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            // Base
            'w-full px-4 py-3 bg-white border rounded-xl text-brown-900 text-base',
            'appearance-none cursor-pointer',
            'transition-colors duration-200',
            // Focus
            'focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500',
            // Disabled
            'disabled:bg-brown-50 disabled:text-brown-400 disabled:cursor-not-allowed',
            // Error
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-brown-200',
            // Padding para el ícono
            'pr-10',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Ícono dropdown */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

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
  )
})

Select.displayName = 'Select'

export default Select
