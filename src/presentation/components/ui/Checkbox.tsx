import { forwardRef, type InputHTMLAttributes, useId } from 'react'
import { clsx } from 'clsx'
import { Check } from 'lucide-react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label?: string
  description?: string
  error?: string
  id?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const generatedId = useId()
    const checkboxId = id || generatedId

    return (
      <div className={clsx('flex items-start', className)}>
        <label
          htmlFor={checkboxId}
          className="relative flex items-center justify-center cursor-pointer"
        >
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="peer sr-only"
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />

          <div
            className={clsx(
              'w-5 h-5 border-2 rounded-md transition-all duration-200',
              'flex items-center justify-center',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-terracotta-500 peer-focus-visible:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              'peer-checked:bg-terracotta-500 peer-checked:border-terracotta-500',
              error
                ? 'border-error'
                : 'border-brown-300 hover:border-terracotta-500'
            )}
          />
          <Check
            className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
            strokeWidth={3}
          />
        </label>

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
              <p className="text-sm text-brown-500 mt-0.5">{description}</p>
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
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
