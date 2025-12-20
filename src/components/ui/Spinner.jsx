import { clsx } from 'clsx'

/**
 * Componente Spinner para estados de carga
 *
 * @param {object} props
 * @param {'sm'|'md'|'lg'} props.size - Tamaño del spinner
 * @param {'terracotta'|'white'|'brown'} props.color - Color
 * @param {string} props.text - Texto de carga opcional
 * @param {boolean} props.center - Si centrar en el contenedor
 * @param {boolean} props.fullScreen - Si ocupar toda la pantalla
 */
const Spinner = ({
  size = 'md',
  color = 'terracotta',
  text,
  center = false,
  fullScreen = false,
  className,
  ...props
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const colors = {
    terracotta: 'border-terracotta-500',
    white: 'border-white',
    brown: 'border-brown-500',
  }

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

  // Con texto
  if (text) {
    return (
      <div className={clsx(
        'flex flex-col items-center gap-3',
        center && 'justify-center min-h-[200px]',
        fullScreen && 'fixed inset-0 bg-cream/80 backdrop-blur-sm z-50 justify-center'
      )}>
        {spinner}
        <p className="text-brown-500 text-sm">{text}</p>
      </div>
    )
  }

  // Centrado simple
  if (center) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {spinner}
      </div>
    )
  }

  // Pantalla completa
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

/**
 * Spinner inline para botones o textos
 */
Spinner.Inline = ({ size = 'sm', color = 'white' }) => (
  <Spinner size={size} color={color} className="-ml-1 mr-2" />
)

export default Spinner
