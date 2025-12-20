import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Check } from 'lucide-react'

/**
 * Componente Checkbox reutilizable
 *
 * @param {object} props
 * @param {string} props.label - Label del checkbox
 * @param {string} props.description - Descripción adicional
 * @param {string} props.error - Mensaje de error
 * @param {boolean} props.checked - Si está marcado
 */
const Checkbox = forwardRef(({
  label,
  description,
  error,
  checked = false,
  className,
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={clsx('flex items-start', className)}>
      {/* Checkbox personalizado */}
      <div className="relative flex items-center justify-center">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        {/* Caja visual */}
        <div
          className={clsx(
            'w-5 h-5 border-2 rounded-md transition-all duration-200 cursor-pointer',
            'flex items-center justify-center',
            // Estados
            'peer-focus-visible:ring-2 peer-focus-visible:ring-terracotta-500 peer-focus-visible:ring-offset-2',
            'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
            // Colores según estado
            checked
              ? 'bg-terracotta-500 border-terracotta-500'
              : error
                ? 'border-error'
                : 'border-brown-300 peer-hover:border-terracotta-500'
          )}
        >
          {/* Checkmark */}
          {checked && (
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          )}
        </div>
      </div>

      {/* Label y descripción */}
      {(label || description) && (
        <div className="ml-3 flex-1">
          {label && (
            <label
              htmlFor={checkboxId}
              className={clsx(
                'text-sm font-medium cursor-pointer select-none',
                error ? 'text-error' : 'text-brown-700'
              )}
            >
              {label}
            </label>
          )}

          {description && (
            <p className="text-sm text-brown-500 mt-0.5">
              {description}
            </p>
          )}

          {error && (
            <p className="text-sm text-error mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
