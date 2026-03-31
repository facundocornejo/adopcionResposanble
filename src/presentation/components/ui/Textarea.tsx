import { forwardRef, type TextareaHTMLAttributes, useId } from 'react'
import { clsx } from 'clsx'

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label?: string
  error?: string
  helperText?: string
  showCount?: boolean
  id?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
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
    },
    ref
  ) => {
    const generatedId = useId()
    const textareaId = id || generatedId
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-brown-700"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          value={value}
          className={clsx(
            'w-full px-4 py-3 bg-white border rounded-xl text-brown-900 text-base',
            'placeholder:text-brown-300',
            'transition-colors duration-200',
            'resize-none',
            'focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500',
            'disabled:bg-brown-50 disabled:text-brown-400 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-brown-200',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        <div className="flex justify-between items-start">
          <div className="flex-1">
            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}

            {helperText && !error && (
              <p className="text-sm text-brown-500">{helperText}</p>
            )}
          </div>

          {showCount && maxLength && (
            <span
              className={clsx(
                'text-sm ml-2',
                currentLength >= maxLength ? 'text-error' : 'text-brown-400'
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
