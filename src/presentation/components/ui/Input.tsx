import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  id?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brown-700"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={clsx(
              'w-full px-4 py-3 bg-white border rounded-xl text-brown-900 text-base',
              'placeholder:text-brown-300',
              'transition-colors duration-200',
              'focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500',
              'disabled:bg-brown-50 disabled:text-brown-400 disabled:cursor-not-allowed',
              error
                ? 'border-error focus:border-error focus:ring-error'
                : 'border-brown-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-brown-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
