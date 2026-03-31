import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export type SpinnerSize = 'sm' | 'md' | 'lg'
export type SpinnerColor = 'terracotta' | 'white' | 'brown'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  color?: SpinnerColor
  text?: string
  center?: boolean
  fullScreen?: boolean
}

const sizes: Record<SpinnerSize, string> = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

const colors: Record<SpinnerColor, string> = {
  terracotta: 'border-terracotta-500',
  white: 'border-white',
  brown: 'border-brown-500',
}

function Spinner({
  size = 'md',
  color = 'terracotta',
  text,
  center = false,
  fullScreen = false,
  className,
  ...props
}: SpinnerProps) {
  const spinner = (
    <div
      className={clsx(
        'border-4 rounded-full animate-spin',
        'border-t-transparent',
        sizes[size],
        colors[color],
        className
      )}
      role="status"
      aria-label="Cargando"
      {...props}
    />
  )

  if (text) {
    return (
      <div
        className={clsx(
          'flex flex-col items-center gap-3',
          center && 'justify-center min-h-[200px]',
          fullScreen &&
            'fixed inset-0 bg-cream/80 backdrop-blur-sm z-50 justify-center'
        )}
      >
        {spinner}
        <p className="text-brown-500 text-sm">{text}</p>
      </div>
    )
  }

  if (center) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">{spinner}</div>
    )
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

interface InlineProps {
  size?: SpinnerSize
  color?: SpinnerColor
}

Spinner.Inline = function InlineSpinner({
  size = 'sm',
  color = 'white',
}: InlineProps) {
  return <Spinner size={size} color={color} className="-ml-1 mr-2" />
}

export default Spinner
