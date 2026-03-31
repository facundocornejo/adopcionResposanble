import { forwardRef, type SelectHTMLAttributes, useId } from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'

export interface SelectOption<T = string> {
  value: T
  label: string
}

export interface SelectProps<T = string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label?: string
  error?: string
  helperText?: string
  options?: SelectOption<T>[]
  placeholder?: string
  id?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Seleccionar...',
      required = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || generatedId

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-brown-700"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'w-full px-4 py-3 bg-white border rounded-xl text-brown-900 text-base',
              'appearance-none cursor-pointer',
              'transition-colors duration-200',
              'focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500',
              'disabled:bg-brown-50 disabled:text-brown-400 disabled:cursor-not-allowed',
              error
                ? 'border-error focus:border-error focus:ring-error'
                : 'border-brown-200',
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
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {error && (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-brown-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
